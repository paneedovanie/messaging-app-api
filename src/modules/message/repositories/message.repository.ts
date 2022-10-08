import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../../../entities';

const idPipeline = [
  {
    $project: {
      doc: '$$ROOT',
    },
  },
  {
    $replaceWith: {
      $mergeObjects: [{ id: '$_id' }, '$doc'],
    },
  },
];

export class MessageRepository extends EntityRepository<Message> {
  async generate(data: CreateMessageDto): Promise<Message> {
    const message = this.create(data);
    await this.em.persistAndFlush(message);
    return this.findOne({ id: message.id }, { populate: ['user', 'channel'] });
  }

  findLatestMessages(id: ObjectId, userId: ObjectId): Promise<Message[]> {
    return this.aggregate([
      {
        $lookup: {
          from: 'user',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: idPipeline,
        },
      },
      {
        $lookup: {
          from: 'channel',
          localField: 'channel',
          foreignField: '_id',
          as: 'channel',
          pipeline: [
            ...idPipeline,
            {
              $lookup: {
                from: 'seen',
                localField: '_id',
                foreignField: 'channel',
                as: 'userLastSeen',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$user', { $toObjectId: userId }],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $project: {
          createdAt: 1,
          content: 1,
          user: 1,
          channel: 1,
          userIds: {
            $arrayElemAt: ['$channel.users', 0],
          },
        },
      },
      {
        $unwind: '$userIds',
      },
      {
        $match: {
          $expr: {
            $eq: ['$userIds', { $toObjectId: id }],
          },
        },
      },
      {
        $addFields: {
          lastSeen: {
            $arrayElemAt: [{ $arrayElemAt: ['$channel.userLastSeen', 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          channel: 1,
          user: 1,
          content: 1,
          id: 1,
          lastSeen: 1,
          unread: {
            $cond: [
              {
                $gt: ['$createdAt', '$lastSeen.updatedAt'],
              },
              1,
              0,
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$channel',
          totalUnread: { $sum: '$unread' },
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$doc', { unread: '$totalUnread' }] },
        },
      },
      {
        $addFields: {
          id: '$_id',
          user: { $arrayElemAt: ['$user', 0] },
          channel: {
            $arrayElemAt: ['$channel', 0],
          },
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'channel.users',
          foreignField: '_id',
          as: 'channel_users',
          pipeline: [
            ...idPipeline,
            {
              $lookup: {
                from: 'online',
                localField: 'online',
                foreignField: '_id',
                as: 'online',
              },
            },
            {
              $addFields: {
                online: {
                  $arrayElemAt: ['$online', 0],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          channel: {
            id: '$channel._id',
            users: '$channel_users',
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  }
}

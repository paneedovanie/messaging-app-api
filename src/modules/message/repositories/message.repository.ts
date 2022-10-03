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

  findLastestMessages(id: ObjectId): Promise<Message[]> {
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
          from: 'online',
          localField: 'user.online',
          foreignField: '_id',
          as: 'online',
        },
      },
      {
        $lookup: {
          from: 'channel',
          localField: 'channel',
          foreignField: '_id',
          as: 'channel',
          pipeline: idPipeline,
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
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$channel',
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
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
    ]);
  }
}

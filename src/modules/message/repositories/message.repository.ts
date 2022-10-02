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
        $lookup: {
          from: 'user',
          localField: 'channel.users',
          foreignField: '_id',
          as: 'channel_users',
          pipeline: idPipeline,
        },
      },
      {
        $project: {
          createdAt: 1,
          content: 1,
          user: { $arrayElemAt: ['$user', 0] },
          channel_users: {
            name: 1,
            username: 1,
            createdAt: 1,
            updatedAt: 1,
            id: 1,
          },
          channel: { $arrayElemAt: ['$channel', 0] },
        },
      },
      {
        $project: {
          id: 1,
          createdAt: 1,
          content: 1,
          user: {
            id: 1,
            name: 1,
            username: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          channel: {
            createdAt: 1,
            updatedAt: 1,
            id: 1,
            users: '$channel_users',
          },
        },
      },
    ]);
  }
}

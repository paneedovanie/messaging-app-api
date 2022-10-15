import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { Channel } from '../../../entities';

export class ChannelRepository extends EntityRepository<Channel> {
  async generate(users: ObjectId[]): Promise<Channel> {
    const channel = this.create({ users });
    await this.em.persistAndFlush(channel);
    return this.findOne({ id: channel.id }, { populate: ['users'] });
  }

  async getMessages(id: ObjectId): Promise<Channel> {
    return (
      await this.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: id }],
            },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'users',
            foreignField: '_id',
            as: 'users',
            pipeline: [
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
                  id: '$_id',
                  online: {
                    $arrayElemAt: ['$online', 0],
                  },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'message',
            localField: '_id',
            foreignField: 'channel',
            as: 'messages',
            pipeline: [
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 20,
              },
              {
                $sort: {
                  createdAt: 1,
                },
              },
              {
                $lookup: {
                  from: 'user',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user',
                  pipeline: [
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
                        id: '$_id',
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
                  user: {
                    $arrayElemAt: ['$user', 0],
                  },
                },
              },
            ],
          },
        },
      ])
    )[0];
  }
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CityEntity } from './city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    const citiesCache: CityEntity[] = await this.cacheManager.get(`${stateId}`);

    if (citiesCache) {
      return citiesCache;
    }

    const cities = await this.cityRepository.find({
      where: {
        stateId,
      },
    });

    await this.cacheManager.set(`${stateId}`, cities);

    return cities;
  }
}

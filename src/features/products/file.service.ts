import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUtilsService {
  async imageExists(productId: number): Promise<boolean> {
    const regex = new RegExp(`^${productId}-\\d+\\.(jpg|jpeg|png|webp)$`, 'i');
    const directory = join(__dirname, '../../../public/products');

    try {
      const files = await fs.readdir(directory);

      for (const file of files) {
        if (regex.test(file)) {
          await fs.access(join(directory, file), fs.constants.F_OK);
          return true;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  async getImagePath(productId: number): Promise<string | null> {
    const regex = new RegExp(`^${productId}-\\d+\\.(jpg|jpeg|png|webp)$`, 'i');
    const directory = join(__dirname, '../../../public/products');

    try {
      const files = await fs.readdir(directory);
      for (const file of files) {
        if (regex.test(file)) {
          return `/products/${file}`;
        }
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

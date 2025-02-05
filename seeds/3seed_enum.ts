import type { Knex } from 'knex';
import { PaymentMethod, PaymentStatus, ProductType, RepairStatus, SaleStatus } from '../src/common/enums/global.enum';
import { USER_TYPE } from '../src/modules/user/enum/user.enum';

export async function seed(knex: Knex): Promise<void> {
  // await knex('enum').del();

  // Inserts seed entries
  await knex('enum').insert([
    {
      key: 'settings',
      value: JSON.stringify({
        shopName: 'Shop Name',
        currencyName: 'USD',
        currencySymbol: '$',
      }),
    },
    {
      key: 'saleStatus',
      value: JSON.stringify(Object.values(SaleStatus)),
    },
    {
      key: 'repairStatus',
      value: JSON.stringify(Object.values(RepairStatus)),
    },
    {
      key: 'paymentMethod',
      value: JSON.stringify(Object.values(PaymentMethod)),
    },
    {
      key: 'paymentStatus',
      value: JSON.stringify(Object.values(PaymentStatus)),
    },
    {
      key: 'userRoles',
      value: JSON.stringify(Object.values(USER_TYPE)),
    },
    {
      key: 'productType',
      value: JSON.stringify(Object.values(ProductType)),
    },
  ]);
}

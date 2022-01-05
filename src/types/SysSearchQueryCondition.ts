// 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
// 该文件的 HASH值为 ###H#A#S#H###39d9680dbac5c586abc6745b6d13ac4e69a1cbd04efd56fb6b84af67cb5f0fb0###H#A#S#H###， 
// 如果你修改了该文件，会使它断开与 ZZ-CODE-GEN 的关联，即下次生成文件的时候，不会更新该文件

export interface SysSearchQueryCondition {
  column_id: number;
  column_sql: string;
  conditions: Array<SysSearchQueryCondition>;
  operator: string;
  value: any;
}

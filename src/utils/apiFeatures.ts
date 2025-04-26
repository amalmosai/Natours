export class TourQueryBuilder {
  // builder pattern
  private queryOptions: any = { where: { AND: [] } };

  constructor(private queryParams: any) {}

  // 1) Filtering need refactor
  filter(): this {
    // query ex ?duration[gte]=5&difficulty=easy
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        const value = queryObj[key];

        if (typeof value === 'object' && value !== null) {
          const condition: any = {};

          const conditions = ['gt', 'gte', 'lt', 'lte', 'equals'];
          conditions.forEach((cond) => {
            if (value[cond]) {
              condition[cond] = parseInt(value[cond]);
            }
          });

          if (Object.keys(condition).length > 0) {
            this.queryOptions.where.AND.push({ [key]: condition });
          }
        } else {
          this.queryOptions.where.AND.push({ [key]: value });
        }
      }
    }

    if (this.queryOptions.where.AND.length === 0) {
      delete this.queryOptions.where;
    }

    return this;
  }

  // 2) Sorting
  sort(): this {
    if (this.queryParams.sort) {
      const sortParams = this.queryParams.sort.split(',');
      this.queryOptions.orderBy = sortParams.map((param: string) => {
        const [fieldName, order] = param.split(':');
        return {
          [fieldName]: order === 'desc' ? 'desc' : 'asc', //pricd:asc
        };
      });
    } else {
      this.queryOptions.orderBy = { createdAt: 'desc' };
    }

    return this;
  }

  // 3) Field limiting
  limitFields(): this {
    if (this.queryParams.fields) {
      const fieldsParams = this.queryParams.fields.split(',');
      this.queryOptions.select = {};
      fieldsParams.forEach((param: string) => {
        if (!param.startsWith('-')) {
          this.queryOptions.select[param] = true; //conflict wirh omit which excluded fields
        }
      });
    }

    return this;
  }

  // 4) Pagination
  paginate(): this {
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(page, skip);
    this.queryOptions.take = limit;
    this.queryOptions.skip = skip;

    return this;
  }

  // Get the built query options
  build(): any {
    return this.queryOptions;
  }
}

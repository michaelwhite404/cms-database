import { Document,  Query } from "mongoose";
import ParsedQueryString from "../interfaces/queryStringInterface";

class APIFeatures<T extends Document> {
  query: Query<T[], any>
  private queryString: ParsedQueryString;

  /**
   * The current page number
   * @returns {number} The current page number
   * @default 1
   */
  get page(): number {
    return this.queryString.page ? +this.queryString.page : 1;
  }

  /**
   * The maximum number of documents this query will return
   * @returns {number} The maximum number of doucments this query will return
   * @default 100
   */
  get limit(): number {
    return this.queryString.limit ? +this.queryString.limit : 100;
  }
  
  /**
   * 
   * @param query The query being searched
   * @param queryString The parsed query string
   */
  constructor(query: Query<T[], any>, queryString: ParsedQueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /** 
   * Uses the filter query parameter to find documents that match the filter 
   * @returns `this`
   */
  filter(): this {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    //let query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Uses the sort query parameter to set the sort order by fields(s)
   * @returns `this`
   */
  sort(): this {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  /**
   * Uses the fields query parameter to specify which field(s) to include or exclude 
   * in each document 
   * @param {string[]} args An array of fields a developer can use to limit fields directly in code
   * @returns `this`
   */
  limitFields(...args: string[]): this {
    // 3. Field Limiting
    let fields = ""
    // Custom dev limit fields - Disregards "fields" query parameter
    if (args.length > 0) {
      fields = args.join(" ");
    }
    // If "fields" is a query parameter
    else if (this.queryString.fields) {
      fields = this.queryString.fields.split(",").join(" ");
    } else {
      fields = "-__v";
    }
    
    this.query = this.query.select(fields);

    return this;
  }


  paginate(): this {
    // 4. Pagination
    const page = this.page;
    const limit = this.limit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;

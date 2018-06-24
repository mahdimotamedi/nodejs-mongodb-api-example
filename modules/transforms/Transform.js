module.exports = class Transform {

    /**
     * transform a collection of items for send to client
     *
     * @param items
     * @return {*}
     */
    transformCollection(items) {
        if (!items)
            return [];

        if(this.withPaginateStatus) {
            return {
                [this.CollectionName()] : items.map(this.transform.bind(this)),
                ...this.paginateItem(items)
            }
        }
        return items.map(this.transform.bind(this))
    }

    /**
     * when you used paginate function of
     *
     * @param items
     * @return {*}
     */
    paginateItem(items) {
        if (this.withPaginateStatus)
            return {
                total : items.total,
                limit : items.limit,
                page : items.page,
                pages : items.pages
            };
        return {};
    }

    /**
     * the name of collection in response
     *
     * @return {string}
     * @constructor
     */
    CollectionName() {
        return 'items';
    }

    /**
     * use this function before transform to activate paginate
     *
     * @return {module.Transform}
     */
    withPaginate() {
        this.withPaginateStatus = true;
        return this;
    }

}
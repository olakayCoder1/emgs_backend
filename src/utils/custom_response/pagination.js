class Paginator {
    constructor(data, request) {
        this.data = data;
        this.request = request;
    }

    paginate(pageSize = 10) {
        const page = parseInt(this.request.query.page) || 1;
        const offset = (page - 1) * pageSize;
        const paginatedData = this.data.slice(offset, offset + pageSize);

        return {
            currentPage: page,
            totalItems: this.data.length,
            totalPages: Math.ceil(this.data.length / pageSize),
            data: paginatedData
        };
    }
}

module.exports = Paginator;

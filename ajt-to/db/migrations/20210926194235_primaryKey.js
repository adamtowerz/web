exports.up = function (knex) {
    return knex.schema.alterTable("aliases", function (t) {
        t.primary('alias');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("aliases", function (t) {
        t.primary();
    });
};

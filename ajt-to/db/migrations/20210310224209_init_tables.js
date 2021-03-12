module.exports.up = async function up(knex) {
  return knex.schema.createTable("aliases", function (t) {
    t.increments("id").unsigned().primary();
    t.text("link").unique();
    t.text("label").nullable();
    t.integer("priority").nullable();
    t.specificType("aliases", "text ARRAY").defaultTo("{}");
    t.boolean("internal").defaultTo(true);
  });
};

module.exports.down = async function down(knex) {
  return knex.schema.dropTable("aliases");
};

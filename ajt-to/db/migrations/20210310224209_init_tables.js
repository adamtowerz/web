module.exports.up = async function up(knex) {
  return knex.schema.createTable("aliases", function (t) {
    t.text("alias").unique();
    t.text("link");
    t.text("label").nullable();
    t.integer("priority").nullable();
    t.boolean("internal").defaultTo(true);
  });
};

module.exports.down = async function down(knex) {
  return knex.schema.dropTable("aliases");
};

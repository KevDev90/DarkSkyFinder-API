const FoldersService = {
    getAllFolders(knex) {
      return knex.select("*").from("darksky_folders");
    },
    insertFolder(knex, newFolder) {
      return knex
         .insert(newFolder)
         .into('darksky_folders')
         .returning('*')
         .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from("darksky_folders").select("*").where("id", id).first();
    },
    deleteFolder(knex, id) {
      return knex("darksky_folders").where({ id }).delete();
    },
    updateFolder(knex, id, newFolderFields) {
      return knex("darksky_folders").where({ id }).update(newFolderFields);
    },
  };

  module.exports = FoldersService;
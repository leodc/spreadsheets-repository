conn = new Mongo();
db = conn.getDB("cide");
db.personas.createIndex({ clean_name: "text" }, { default_language: "spanish" });

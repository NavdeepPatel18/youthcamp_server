const { PrismaClient } = require("@prisma/client");

const BaseController = require("./BaseController");
const prisma = new PrismaClient();

module.exports = class BlogController extends BaseController {
  async createBlog(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.data) {
      const { title, tags, description } = JSON.parse(req.body.data);

      const data = {
        title: title,
        tags: tags,
        description: description,
        admin_id: req.userId,
      };

      try {
        if (req.file) {
          data.photo = process.env.BaseUrl + "/images/" + req.file.filename;
        }

        await prisma.blog.create({
          data: data,
        });

        res.json({ status: "ok" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "some thing went wrong" });
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async updateBlog(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.body.data) {
      const BlogId = parseInt(req.params.id);
      const { title, tags, description } = JSON.parse(req.body.data);

      const data = {
        title: title,
        tags: tags,
        description: description,
        admin_id: req.userId,
      };

      const type = await prisma.blog.findUnique({
        where: {
          id: BlogId,
        },
      });

      if (type) {
        try {
          console.log(req.file);
          if (req.file) {
            data.photo = process.env.BaseUrl + "/images/" + req.file.filename;
          }

          const result = await prisma.blog.update({
            where: {
              id: BlogId,
            },
            data: data,
          });

          if (result) {
            res.json({ status: "ok", data: result });
          } else {
            res.json({ status: "error", error: "some thing went wrong" });
          }
        } catch (error) {
          console.log(error);
          res.json({ status: "error", error: "some thing went wrong" });
        }
      }
    } else {
      res.json({
        status: "error , no data pass",
      });
    }
  }
  async deleteBlog(req, res) {
    if (!req.isAuth && req.userType === "ADMIN") {
      return res.json({ status: "error", error: "You  not have access" });
    }

    if (req.params.id) {
      try {
        const BlogID = parseInt(req.params.id);

        const find_teamMate = await prisma.blog.findUnique({
          where: {
            id: BlogID,
          },
        });

        if (find_teamMate) {
          const delete_blog = await prisma.blog.delete({
            where: {
              id: BlogID,
            },
          });

          if (delete_blog) {
            res.json({ status: "ok", response: "deleted" });
          } else {
            res.json({ status: "error", error: "not deleted" });
          }
        } else {
          res.json({ status: "error", error: "teammember not exisits" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    } else {
      res.json({
        status: "error , teamMember id not defind",
      });
    }
  }
  async getBlog(req, res) {
    try {
      const result = await prisma.blog.findMany();

      return res.json({ status: "ok", data: result });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ";))" });
    }
  }
};

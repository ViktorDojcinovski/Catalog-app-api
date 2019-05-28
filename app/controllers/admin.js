const Page = require('../models/page');

exports.postAddPage = (req, res, next) => {
    const name = req.body.page.name;
    const page_content = req.body.page.page_content;
    const html_elements = req.body.page.html_elements;
    const page = new Page({
        name: name,
        page_content: page_content,
        html_elements: html_elements
    });
    page
        .save()
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
            });
};

exports.getEditPage = (req, res, next) => {
    const pageId = req.params.pageId;
    Page.findById(pageId)
      .then(page => {
          res.json(page);
      })
      .catch(err => console.log(err));
};

exports.postEditPage = (req, res, next) => {
    const pageId = req.body.page.pageId;
    const updatedName = req.body.page.name;
    const updatedContent = req.body.page.page_content;
    const updatedElements = req.body.page.html_elements;

    console.log(pageId);

    Page.findById(pageId)
        .then(page => {
            page.name = updatedName;
            page.page_content = updatedContent;
            page.html_elements = updatedElements;
            return page.save();
        })
        .then(result => {
            console.log('UPDATED PAGE!');
            res.json(result);
        })
        .catch(err => console.log(err));
};

exports.getPages = (req, res, next) => {
    Page.find()
        .then(pages => {
            res.json(pages);
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postDeletePage = (req, res, next) => {
    const pageId = req.body.pageId;
    Page.findByIdAndRemove(pageId)
        .then(() => {
            Page.find()
                .then(pages => {
                    res.json(pages);
                })
        })
        .catch(err => console.log(err));
};

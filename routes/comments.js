const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const { findByIdAndRemove } = require('../models/comment');

// ===============
// COMMENTS ROUTES
// ===============

router.get('/new', middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
        //create new comment
        Comment.create(req.body.comment, (err, comment) => {
            if (err) {
                req.flash('error', 'Something went wrong.');
                console.log(err);
            } else {
            //connect new comment to campground
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash('success', 'Successfully added comment.');
            //redirect to campground show page
            res.redirect('/campgrounds/' + campground._id);
            }
        })
        }
    });
})

//comments edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {  
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//comment update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

module.exports = router;

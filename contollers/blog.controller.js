const Joi = require('joi');
const Blog = require('../modules/Blog');
const Follow = require('../modules/Follow');          
const createBlog = async (req,res) =>{        

        const isValid = Joi.object({ 
                title : Joi.string().required(),
                textBody:  Joi.string().max(1000).required(),  
        }).validate(req.body);

        if(isValid.error){
                return res.status(400).send({    
                     status : 400,
                     message : "Invalid data format",
                     data : isValid.error,
                });  
               }  
                  console.log(req.body.textBody);
                const blogObj = new Blog({
                       title : req.body.title,
                       textBody : req.body.textBody,
                       userId : req.params.userId,
                });
 
                try{    
                            await blogObj.save();
                            res.status(201).send({
                                   status:201,
                                   message : "Blog created successfully!"
                            });
                } catch{
                       res.status(400).send({
                             status : 400,
                             message : "Blog creation failed",
                       }); 
                }
              }
 const getuserBlog = async (req,res)=>{
       try{ 
                  
       let userId = req.params.userId;
       let page = req.query.page || 1;

       let Limit = 10;

  
       const myBlogData = await Blog.find({userId,isDeletion:false})
       .sort({creationDateTime: -1})
       .skip(parseInt(page)-1)
       .limit(Limit);

 console.log(myBlogData);    

res.status(200).send({ 
        status : 200,
        message : "succesfully fetched data!",
        data : myBlogData, 
});
       }catch(err){ 
                            
               res.status(400).send({
                         status : 200,
                         meassage : "data failed to fetch!",
                         data : err,
               });
       };



 }
         

 const deleteblog = async (req ,res) =>{
              const blogId = req.params.blogId;  

              try{
                     await Blog.findOneAndUpdate( 
                        {
                                _id : blogId,  
                        },
                        { isDeleted : true, deletionDataTime : Date.now() }
                     );


                     res.status(200).send({
                        status: 200,
                        message: "Blog has been successfully deleted!",
                      });
                    } catch (err) {
                      res.status(400).send({
                        stauts: 400,
                        message: "Unable to delete the blog!",  
                      });
                    }
                  };
                   
        const editblog = async (req,res)=>{
                    const {blogId ,title,textBody} = req.body; 
                    const userId = req.params.userid;
     
                    try{ 
                         const blogdata = await Blog.findById(blogId);
                         if (!blogdata) {
                          return res.status(404).json({
                            status: 404,
                            message: "Blog not found",
                          });
                        }

                        if(!(blogdata.userId && blogdata.userId.toString() === userId.toString())){
                                console.log("data not matched");
                                return res.status(401).json({    
                                        status: 401,
                                        message: "Not allowed to edit, Authorization failed!",
                                      });
                        }    
                           console.log("try is ok");
                        const creationDateTime = blogdata.creationDateTime.getTime();
                        const currentDateTime = Date.now();
                        console.log("try is ok 1");
                        const diff = (currentDateTime - creationDateTime) / (1000 * 60);
                        console.log("try is ok 2");  
                        if(diff > 30){  
                                return res.status(400).json({
                                        status: 400,
                                        message: "Not allowed to edit after 30 minutes of creation!",
                                      });
                        } 
                        console.log("try is ok 3");
                    }catch (err) { 
                        res.status(400).send({
                          status: 400,
                          message: "Unable to allow the blog!",
                        });  
                      } 
   
                     try{
                           const newblogData = {
                                title,
                                textBody,
                           };
                            await Blog.findOneAndUpdate({ _id : blogId }, newblogData);

                            res.status(200).json({
                                status: 200,
                                message: "Blog edited successfully!",
                            })

                      } catch (err) {
                        console.error(err);  
                res.status(500).json({
                  status: 400,
               message: "Unable to edit the blog!",  
            }); 
         
        }
    
        } 

        const getHomepageBlogs = async (req, res) => {
          const userId = req.params.userid;  
          try {
            const followingList = await Follow.find({ followerUserId: userId });
        
            let followingUserId = [];   
            followingList.forEach((followObj) => {
              followingUserId.push(followObj.followingUserId); 
              console.log("getting",followingUserId);
            });
        
            const followingBlogs = await Blog.find({ 
              userId: { $in: followingUserId },
              //  isDeleted: false,
            }); 
            console.log("followingblog",followingBlogs);
            res.status(200).send({
              status: 200,
              message: "Fetched all homepage blogs!", 
              data: followingBlogs,
            });
          } catch (err) {
            res.status(400).send({  
              status: 400,
              message: "Unable to find the blogs!",  
            });
          }
        };  
          


module.exports = {createBlog,getuserBlog,deleteblog,editblog,getHomepageBlogs}; 

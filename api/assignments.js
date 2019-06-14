const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const {requireAuthentication}=require('../lib/auth');
const pa=require('path');
const { extractValidFields } = require('../lib/validation');
const AssignmentsSchema = {
    courseid: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true }
};
const {PushTheFileInFs,getAssignmentsById,updateAssignment,getCourseByid,getSumbitByAsgid,insertNewAssignments,insertNewSumbit,deleteAssignmentByid,getDownloadStreamByFilename,getSubmissionPage} = require("../models/assignments");
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/uploads`,
        filename: (req, file, callback) => {
            const basename = crypto.pseudoRandomBytes(16).toString('hex');
            //const extension = imageTypes[file.mimetype];
            var fileFormat = (file.originalname).split(".");
            const extension = fileFormat[fileFormat.length - 1];
            callback(null, `${basename}.${extension}`);
        }
    }),
});
function removeUploadedFile(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file.path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

}


router.post("/",requireAuthentication,async(req,res)=>{
    console.log("Hello1");
    console.log(req.user);
    if(req.usertype=="instructor"){
        console.log("Hello4")
    }
    if(req.usertype=="admin"){
        console.log("Hello3");
        try{
            if(extractValidFields(req.body,AssignmentsSchema)){
                const id=await insertNewAssignments(req.body);
                res.status(201).send({
                    id: id,
                    links: {
                        url: `/assignments/${id}`
                    }
                });
            }else{
                res.status(400).send({
                    error:"Not a vaild assignment object"
                })
            }
        }catch (err) {
            console.error(err);
            res.status(500).send({
                error: "Error inserting photo into DB.  Please try again later."
            });
        }

    }
    if(req.usertype=="instructor"){
        console.log("Hello2");
        console.log(req.body.courseid);
        if(req.body.courseid){
            console.log(1);
            const courseinfo=await getCourseByid(parseInt(req.body.courseid));
            if(courseinfo.instructor==req.user){
                try{
                    if(1==1){
                        const id=await insertNewAssignments(req.body);
                        res.status(201).send({
                            id: id,
                            links: {
                                url: `/assignments/${id}`
                            }
                        });
                    }else{
                        res.status(400).send({
                            error:"Not a vaild assignment object"
                        })
                    }
                }catch(err){
                    console.error(err);
                    res.status(500).send({
                        error: "Error inserting photo into DB.  Please try again later."
                    });
                }
            }else{
                res.status(401).send({
                   error:"NotPermission"
                });
            }
        }
    }
});

router.get("/:id",async(req,res)=>{
    const id=parseInt(req.params.id);
    const assignment=await getAssignmentsById(id);
    res.status(200).send(assignment);
});


router.put("/:id",requireAuthentication,async(req,res)=>{
    if(req.usertype=='admin'){
        try{
            if(extractValidFields(req.body,AssignmentsSchema)){
                result=await updateAssignment(req.body,parseInt(req.params.id));
                if(result){
                    const id=parseInt(req.params.id);
                    res.status(200).send({
                        id: id,
                        links: {
                            url: `/assignments/${id}`
                        }
                    });
                }else{
                    next();
                }

            }else{
                res.status(400).send({
                    error:"Not a vaild assignment object"
                })
            }
        }catch(err){
            console.error(err);
            res.status(500).send({
                error: "Error on updating the assignment"
        });
        }
    }
    if(req.usertype=="instructor"){
        if(req.body){
            const id=parseInt(req.params.id);
            const asg=await getAssignmentsById(id);
            const courseid=parseInt(asg.courseid);
            const courseinfo=await getCourseByid(courseid);
            console.log("33233");
            //const courseinfo=await getCourseByid(parseInt(req.body.courseid));
            if(courseinfo.instructor==req.user){
                console.log("44444444");
                try{
                    if(extractValidFields(req.body,AssignmentsSchema)){
                        result=await updateAssignment(req.body,parseInt(req.params.id));
                        if(result){

                            res.status(200).send({
                                id: id,
                                links: {
                                    url: `/assignments/${id}`
                                }
                            });
                        }

                    }else{
                        res.status(400).send({
                            error:"Not a vaild assignment object"
                        })
                    }
                }catch(err){
                    console.error(err);
                    res.status(500).send({
                        error: "Error on updating the assignment"
                    });
                }
            }else{
                res.status(401).send({
                    error:"NotPermission"
                });
            }
        }
    }
    if(req.usertype=="student"){
        res.status(401).send({
            error:"NotPermission"
        });
    }
    }
);

router.delete("/:id",requireAuthentication,async(req,res)=>{
    if(req.usertype=="admin"){
        const id=parseInt(req.params.id);
        const result=await deleteAssignmentByid(id);
        if(result){
            res.status(204).end()
        }
    }
    if(req.usertype=="instructor"){
        const id=parseInt(req.params.id);
        const asg=await getAssignmentsById(id);
        const courseid=parseInt(asg.courseid);
        const course=await getCourseByid(courseid);
        if(parseInt(course.instructor)==parseInt(req.user)){
            const result=await deleteAssignmentByid(id);
            if(result){
             res.status(204).end();
            }
        }
    }
});


router.get("/:id/submissions",requireAuthentication,async(req,res)=>{
    const id =parseInt(req.params.id);
    const asg=await getAssignmentsById(id);
    const courseid=parseInt(asg.courseid);
    const course=await getCourseByid(courseid);
    if(req.usertype=="admin"||parseInt(course.instructor)==parseInt(req.user)){
        //const result=await getSumbitByAsgid(id);
        const coursePage = await getSubmissionPage(parseInt(req.query.page) || 1,id);
        coursePage.links = {};
        if (coursePage.page < coursePage.totalPages) {
            coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
            coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
        }
        if (coursePage.page > 1) {
            coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
            coursePage.links.firstPage = '/courses?page=1';
        }
        res.status(200).send(coursePage);
    }else{
        res.status(401).send({
            error:"Not Autorized"
        })
    }
});


router.post("/:id/submissions",requireAuthentication,upload.single("file"),async(req,res)=>{
    assignmentid=parseInt(req.params.id);
    if(req.file){
        const subf = {
                path: req.file.path,
                filename: req.file.filename,
        }

        const fid = await PushTheFileInFs(subf);
        const sub={
            assignmentid:assignmentid,
            studentid:req.user,
            file:"/assignments/files/"+req.file.filename
        }
        try{
            console.log(sub);
            const subid=await insertNewSumbit(sub);
            res.status(201).send({
                submissionid:subid
            });
        }catch(err){
            res.status(500).send({
               error:"Err when submit the assignment"
            });
        }
    }else{
        res.status(400).send({
            error:"Not a vaild assignment object"
        });
    }
});

router.get('/files/:filename', (req, res, next) => {
    console.log("Fname=",req.params.filename);
    getDownloadStreamByFilename(req.params.filename)
        .on('error', (err) => {
            if (err.code === 'ENOENT') {
                next();
            } else {
                next(err);
            }
        })
        .on('file', (file) => {
            res.status(200).type("image/jpeg");
        })
        .pipe(res);
});
module.exports = router;


  import multer from "multer";

  // Set up storage for uploaded files

  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        console.log("File received:", file)
          const fileType = file.mimetype.split('/')[0];
          console.log("File type:", fileType); 
          if(fileType=='image'){
              cb(null , "uploads/");
          }
          
          else{
              cb(new Error("invalid file type"));
          }
      
      },
      filename: (req, file, cb) => {
        console.log("File name:", file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
      }
    
    });

    const upload = multer({ storage: storage });
    

  export default upload;




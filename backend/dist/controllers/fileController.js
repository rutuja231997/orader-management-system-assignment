"use strict";
//upload file to cloudinary
//  const files = req.files as {[fieldname: string]: Express.Multer.File[]};
//  const productFile = files['product_image']?.[0];
//  if(!productFile){
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({message: 'Product image is required'})
//  }
// const productCheck = fileMetaSchema.safeParse(productFile);
// if(!productCheck.success){
//     res.status(400).json({errors:{product: productCheck.error?.flatten?.().fieldErrors}})
//     return 
// }
// const productResult = productFile ? await new Promise<any>((resolve, reject)=>{
//     const stream = cloudinary.uploader.upload_stream({
//         folder: 'orders', resource_type: 'image'
//     }, (error, result)=>{
//             if(error) return reject(error);
//             resolve(result);
//         });
//         stream.end(productFile.buffer);
//     }) : null;
//  const product_image_url = productResult.secure_url;

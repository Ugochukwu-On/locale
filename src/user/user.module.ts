// // users.module.ts
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UserController } from '../user/user.controller';
// import { UserService } from '../user/user.service';
// import { User, UserSchema } from '../model/user.model'

// @Module({
//   imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
//   controllers: [UserController],
//   providers: [UserService],
//   exports: [UserService],
// })
// export class UserModule {}

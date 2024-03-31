import {faker} from '@faker-js/faker';
import {TABLE_USER} from '../modules/user/user.configs';
import {getRandomInt} from '../RamdomString';
import {OrganizationModel} from '../modules/organization/organization/organization.model';
import {UserModel} from '../modules/user/user.model';
import {fakeImages} from './images/images';
import {ClassModel} from '../modules/classes/classes.model';
import {ParentModel} from '../modules/parent/parent.model';
import {StudentModel} from '../modules/student/student.model';
import { getNewToken } from '../../submodules/VTAuthLib/config/passport';

const cId = '652de593d0bcb141c425c2c9';
const uId = '659bbe09a7b88044494a4bf2';
const classCount = 1;

const clean = async () => {
  await Promise.all([
    OrganizationModel.deleteOne({
      _id: cId,
    }),
    UserModel.deleteMany({
      organizationId: cId,
    }),
    ClassModel.deleteMany({
      targetId: cId,
    }),
    StudentModel.deleteMany({
      targetId: cId,
    }),
    ParentModel.deleteMany({
      targetId: cId,
    }),
  ]);
};

const fake = async () => {
  const fakeOrg = async () => {
    await OrganizationModel.create({
      _id: cId,
      name: faker.company.name(),
      avatar: fakeImages.compAvatar,
      description: faker.lorem.words(30),
    });
  };

  const fakeAdmin = async () => {
    await UserModel.create({
      _id: uId,
      organizationId: cId,
      name: faker.company.name(),
      description: faker.lorem.words(30),

      phone: faker.phone.number('+849########'),
      email: faker.internet.email(), // '+48 91 463 61 70'
      fullName: faker.name.fullName(),
      isAdmin: true
    })
    console.log(getNewToken({id: uId}))
  }

  const fakeTeachers = async () => {
    const teacherAvatars = fakeImages.others.slice(0, classCount);
    return Promise.all(
      teacherAvatars.map((sImage: string) =>
        UserModel.create({
          organizationId: cId,
          name: faker.company.name(),
          description: faker.lorem.words(30),

          phone: faker.phone.number('+849########'),
          email: faker.internet.email(), // '+48 91 463 61 70'
          fullName: faker.name.fullName(),
          // hashedPassword: string;
          avatar: sImage,
          // slogan: string;
          // birthday: string;
          // country: string;
          // address: string;
          // aboutme: string;
          // website: string;

          isTeacher: true,
          createdById: uId,
        }),
      ),
    );
  };

  const fakeStudients = async () => {
    return Promise.all(
      fakeImages.others.map(sImg =>
        UserModel.create({
          organizationId: cId,
          name: faker,
          description: faker.name.fullName(),

          phone: faker.phone.number('+849########'),
          email: faker.internet.email(), // '+48 91 463 61 70'
          fullName: faker.name.fullName(),
          // hashedPassword: string;
          avatar: sImg,
          // slogan: string;
          // birthday: string;
          // country: string;
          // address: string;
          // aboutme: string;
          // website: string;
          createdById: uId,
        }),
      ),
    );
  };

  const [org, admin, teachers, studients] = await Promise.all([fakeOrg(),fakeAdmin(), fakeTeachers(), fakeStudients()]);

  const fakeClass = async (teacherIds: string[]) => {
    return Promise.all(
      teacherIds.map((teacherId, index) =>
        ClassModel.create({
          targetId: cId,

          name: `Lớp 1A${index + 1}`,
          teacherId: teacherId,
          createdById: uId,
        }),
      ),
    );
  };

  const teaderIds = teachers.map(t => t.id);
  const classList = await fakeClass(teaderIds);
  const classItem = classList[0];

  await Promise.all(
    studients.map(sId =>
      StudentModel.create({
        targetId: cId,

        studentId: sId,
        classId: classItem.id,
        createdById: uId,
      }),
    ),
  );
};

export const fakeData = async () => {
  await clean();

  await fake();
};

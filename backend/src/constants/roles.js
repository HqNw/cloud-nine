const Role = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
};

const Action = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
};

const Subject = {
  LESSON: 'lesson',
  USER: 'user',
  USER_LESSON: 'userLesson',
};

const DEFAULT_ROLE_PERMISSIONS = {
  [Role.STUDENT]: [
    { action: Action.READ, subject: Subject.LESSON },
    { action: Action.READ, subject: Subject.USER_LESSON },
    { action: Action.UPDATE, subject: Subject.USER_LESSON },
  ],
  [Role.TEACHER]: [
    { action: Action.CREATE, subject: Subject.LESSON },
    { action: Action.READ, subject: Subject.LESSON },
    { action: Action.UPDATE, subject: Subject.LESSON },
    { action: Action.DELETE, subject: Subject.LESSON },
    { action: Action.READ, subject: Subject.USER },
    { action: Action.READ, subject: Subject.USER_LESSON },
  ],
  [Role.ADMIN]: [
    { action: Action.CREATE, subject: Subject.LESSON },
    { action: Action.READ, subject: Subject.LESSON },
    { action: Action.UPDATE, subject: Subject.LESSON },
    { action: Action.DELETE, subject: Subject.LESSON },
    { action: Action.CREATE, subject: Subject.USER },
    { action: Action.READ, subject: Subject.USER },
    { action: Action.UPDATE, subject: Subject.USER },
    { action: Action.DELETE, subject: Subject.USER },
    { action: Action.READ, subject: Subject.USER_LESSON },
    { action: Action.UPDATE, subject: Subject.USER_LESSON },
    { action: Action.DELETE, subject: Subject.USER_LESSON },
  ],
};

export {
  Role,
  Action,
  Subject,
  DEFAULT_ROLE_PERMISSIONS,
};

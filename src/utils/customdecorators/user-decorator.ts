import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (decoratorParam: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      if (decoratorParam) {
        return request.user[decoratorParam];
      } else {
        return request.user;
      }
    } else {
      throw new NotFoundException('Usuário não encontrado no Request.');
    }
  },
);

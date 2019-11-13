export default class MemberDto {
  id: string;
  name: string;
  realName: string;
  avatarUrl: string;

  constructor(id?: string) {
    this.id = id;
  }
}

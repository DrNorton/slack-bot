import { Injectable } from '@nestjs/common';
import MemberDto from './dto/member.dto';
import { MembersService } from './members.service';

@Injectable()
export default class MembersStorage {
  private storage: Map<string, MemberDto[]>;
  constructor(private readonly membersService: MembersService) {
    this.storage = new Map<string, MemberDto[]>();
  }

  public async getMembers(teamId: string): Promise<MemberDto[]> {
    if (this.storage.has(teamId)) {
      return this.storage.get(teamId);
    } else {
      const members = await this.membersService.getMembers(teamId);
      this.storage.set(teamId, members);
      return members;
    }
  }

  public async searchMember(teamId: string, memberId: string): Promise<MemberDto> {
    const memberList = await this.getMembers(teamId);
    return memberList.find(x => x.id === memberId);
  }
}

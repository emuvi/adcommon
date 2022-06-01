export class AdApprised {
  public message: string;
  public popup: boolean;

  constructor(message: string, popup?: boolean) {
    this.message = message;
    this.popup = popup ?? true;
  }
}

export class AdApprise {
  static CANCELED_BY_MUTATIONS = new AdApprised(
    "The user canceled this action to not loose his mutations.",
    false
  );
}

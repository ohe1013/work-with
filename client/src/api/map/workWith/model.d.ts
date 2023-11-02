namespace WorkWith {
  export interface LocItem {
    item: {
      id: number;
      title: string;
      level: string;
      createdAt: number;
      dueTime: number;
      workTime: string;
      maxCount: number;
      currentCount: number;
    };
    success: {
      locId: number;
      items: Array<LocItem.item>;
    };
  }
}
export default WorkWith;

export type Org = {
  id: number
  parentId: number
  orgName: string
  children: Org[] | null
}

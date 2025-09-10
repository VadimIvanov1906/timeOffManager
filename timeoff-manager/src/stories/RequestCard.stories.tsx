import { StoryFn, Meta } from "@storybook/react";
import { RequestCard, RequestCardProps } from "../components/RequestCard";
import "../IonicCss";
const mockRequest: RequestCardProps["req"] = {
  id: "1",
  employee: "Vadim",
  startDate: "2025-10-10",
  endDate: "2025-10-15",
  type: "Vacation",
  status: "Pending",
  notes: "Family trip",
  decisionNote: "",
  createdAt: "2025-10-10",
};

const meta: Meta<typeof RequestCard> = {
  title: "Components/RequestCard",
  component: RequestCard,
};

export default meta;

const Template: StoryFn<RequestCardProps> = (args) => <RequestCard {...args} />;
export const PendingRequest = Template.bind({});
PendingRequest.args = {
  req: mockRequest,
  onApprove: (id: string) =>
    alert(`Request ${id} ${status}`),
};

export const ApprovedRequest = Template.bind({});
ApprovedRequest.args = {
  req: { ...mockRequest, status: "Approved", decisionNote: "Approved by Bob" },
};
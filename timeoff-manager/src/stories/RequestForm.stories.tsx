import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { RequestForm, RequestFormProps } from "../components/RequestForm";
import { PTORequest } from "../types/timeOffTypes";
import "../IonicCss";

const meta: Meta<typeof RequestForm> = {
  title: "Components/RequestForm",
  component: RequestForm,
};

export default meta;

const Template: StoryFn<RequestFormProps> = (args) => <RequestForm {...args} />;

export const DefaultForm = Template.bind({});
DefaultForm.args = {
  currentUser: "Vadim",
  onSubmit: (data: PTORequest) =>
    alert(`Submitted: ${JSON.stringify(data)}`),
};
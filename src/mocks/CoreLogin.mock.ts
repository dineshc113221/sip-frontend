export interface ILoggedInUserDto {
  userName: string;
  password: string;
}

export interface ReactInfiniteProps {
  children: string,
  next: () => void,
  hasMore: boolean,
  loader: string,
  endMessage: string
}

export type MockCoreLoginDto = {
  getLoggedInUserDetails: () => ILoggedInUserDto;
};
const CoreLoginMock: MockCoreLoginDto = jest.createMockFromModule(
  "@consumer/core-login-ui-mf"
);

const __getLoggedInUser = () => {
  return {
    userName: "ITEST250",
    password: "any",
  } as ILoggedInUserDto;
};

CoreLoginMock.getLoggedInUserDetails = __getLoggedInUser;
module.exports = CoreLoginMock;

import { FC } from 'react';
import { Button } from './components/ui/button';

import userActor from './mocks/actors/user.actor';

const App: FC<{ text: string }> = ({ text = 'Login' }) => {
  const handleClick = () => {
    userActor.send(new Event('login'));
  };
  return (
    <Button type="button" onClick={() => handleClick()}>
      {text}
    </Button>
  );
};

export default App;

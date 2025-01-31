import { FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import userActor from '@/mocks/actors/user.actor';

const App: FC<{ text: string }> = () => {
  useEffect(() => {
    userActor.send(new Event('setupFinished'));
  }, []);
  const snapshot = userActor.getSnapshot();
  const { value } = snapshot;
  return (
    <Button type="button" onClick={() => {}}>
      {value}
    </Button>
  );
};

export default App;

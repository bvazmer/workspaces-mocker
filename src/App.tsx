import { FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import userActor from '@/mocks/actors/user.actor';

const App: FC<{ text: string }> = () => {
  const snapshot = userActor.getSnapshot();
  const { value } = snapshot;

  useEffect(() => {
    userActor.send(new Event('setupFinished'));
  }, []);

  return (
    <Button type="button" onClick={() => {}}>
      {value}
    </Button>
  );
};

export default App;

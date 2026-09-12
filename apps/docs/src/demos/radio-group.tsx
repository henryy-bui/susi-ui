import { useState } from 'react';
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '@susi-ui/react';

const PLANS = ['Free', 'Pro', 'Team'];

export default function RadioGroupDemo() {
  const [plan, setPlan] = useState('Pro');

  return (
    <>
      <RadioGroup className="row" aria-label="Plan" value={plan} onValueChange={setPlan} name="plan">
        {PLANS.map((option) => (
          <label className="susi-field" key={option}>
            <RadioGroupItem className="susi-radio" value={option}>
              <RadioGroupIndicator className="susi-radio-indicator" />
            </RadioGroupItem>
            {option}
          </label>
        ))}
      </RadioGroup>

      <span className="state">plan: {plan}</span>
    </>
  );
}

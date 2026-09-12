import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Progress,
  ProgressIndicator,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
  Separator,
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@susi-ui/react';

const meta = { title: 'Inputs/Radio, Slider, Progress, Tooltip' } satisfies Meta;
export default meta;

export const Radios: StoryObj = {
  render: () => (
    <RadioGroup className="row" aria-label="Plan" defaultValue="pro">
      {['free', 'pro', 'team'].map((plan) => (
        <label className="field" key={plan}>
          <RadioGroupItem className="radio" value={plan}>
            <RadioGroupIndicator className="radio-indicator" />
          </RadioGroupItem>
          {plan}
        </label>
      ))}
    </RadioGroup>
  ),
};

export const SingleThumbSlider: StoryObj = {
  name: 'Slider',
  render: () => (
    <Slider className="slider" defaultValue={[40]}>
      <SliderTrack className="slider-track">
        <SliderRange className="slider-range" />
      </SliderTrack>
      <SliderThumb className="slider-thumb" aria-label="Volume" />
    </Slider>
  ),
};

export const RangeSlider: StoryObj = {
  render: function Render() {
    const [range, setRange] = useState([20, 70]);
    return (
      <div className="row">
        <Slider className="slider" value={range} onValueChange={setRange} step={5}>
          <SliderTrack className="slider-track">
            <SliderRange className="slider-range" />
          </SliderTrack>
          <SliderThumb className="slider-thumb" index={0} aria-label="Minimum" />
          <SliderThumb className="slider-thumb" index={1} aria-label="Maximum" />
        </Slider>
        <span className="state">{range.join(' – ')}</span>
      </div>
    );
  },
};

export const ProgressBars: StoryObj = {
  name: 'Progress',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress className="progress" value={35}>
        <ProgressIndicator className="progress-indicator" />
      </Progress>
      <Separator className="separator" />
      <Progress className="progress" value={null}>
        <ProgressIndicator className="progress-indicator" />
      </Progress>
    </div>
  ),
};

export const Tooltips: StoryObj = {
  name: 'Tooltip',
  render: () => (
    <TooltipProvider>
      <div className="row" style={{ padding: 60 }}>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger className="btn">{side}</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="tooltip" side={side}>
                <TooltipArrow className="tooltip-arrow" />
                Hover or focus to see me.
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

import { useState } from 'react';
import { Slider, SliderRange, SliderThumb, SliderTrack } from '@susi-ui/react';

export default function SliderDemo() {
  const [range, setRange] = useState([20, 70]);

  return (
    <>
      <Slider className="susi-slider" defaultValue={[40]}>
        <SliderTrack className="susi-slider-track">
          <SliderRange className="susi-slider-range" />
        </SliderTrack>
        <SliderThumb className="susi-slider-thumb" aria-label="Volume" />
      </Slider>

      {/* Two thumbs: one value each, and they cannot cross */}
      <Slider className="susi-slider" value={range} onValueChange={setRange} step={5}>
        <SliderTrack className="susi-slider-track">
          <SliderRange className="susi-slider-range" />
        </SliderTrack>
        <SliderThumb className="susi-slider-thumb" index={0} aria-label="Minimum" />
        <SliderThumb className="susi-slider-thumb" index={1} aria-label="Maximum" />
      </Slider>

      <span className="state">{range.join(' – ')}</span>
    </>
  );
}

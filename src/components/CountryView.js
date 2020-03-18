import React from 'react'
import SlopeChart from './SlopeChart'
import BumpChart from './BumpChart'
import LineChart from './LineChart'
import Timeline from './Timeline'

const Heading = ({ children }) => <h5>{children}</h5>

export default ({ data }) => (
  <div style={{ display: 'flex' }}>
    <div>
      <Heading>Trend</Heading>
      <SlopeChart
        data={data}
        width={100}
        height={300}
        start={2015}
        end={2031}
      />
    </div>
    <div>
      <Heading>Trend (clipped)</Heading>
      <SlopeChart
        data={data}
        width={100}
        height={300}
        start={2015}
        end={2031}
        clipDomain={true}
      />
    </div>
    <div>
      <Heading>Ranking</Heading>
      <BumpChart
        data={data}
        width={600}
        height={data.length * 20}
        start={2015}
        end={2031}
      />
    </div>
    <div>
      <Heading>Timeline</Heading>
      <Timeline
        data={data}
        width={600}
        height={data.length * 20}
        start={2015}
        end={2031}
      />
    </div>
    <div>
      <Heading>Absolute value</Heading>
      <LineChart data={data} width={600} height={300} start={2015} end={2031} />
    </div>
    <div>
      <Heading>Absolute value (clipped)</Heading>
      <LineChart
        data={data}
        width={600}
        height={300}
        start={2015}
        end={2031}
        clipDomain={true}
      />
    </div>
  </div>
)

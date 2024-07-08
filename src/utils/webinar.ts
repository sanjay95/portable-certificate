const webinarDetails: WebinarDetailsType[] = [
  {
    id: 1,
    webinardate: '25th April 2024',
    desc: 'At Affinidi, we believe in the power of collaboration & innovation. Thank you for diving into the world of digital trust, decentralised identity, and revolutionary technologies that are shaping the future of identity management. Reclaim Your Data. Reclaim Your Identity. Reclaim Your Self.',
    webinartitle: 'Revolutions Identity Management in the New Data Economy',
  },
  {
    id: 2,
    webinardate: '23rd May 2024',
    desc: 'At Affinidi, we believe in the power of collaboration & innovation. Thank you for diving into the world of digital trust, decentralised identity, and revolutionary technologies that are shaping the future of identity management. Reclaim Your Data. Reclaim Your Identity. Reclaim Your Self.',
    webinartitle: 'Harnessing Cross-Platform Loyalty with Zero Party Data and Holistic Identity',
  },
  {
    id: 3,
    webinardate: '20th June 2024',
    desc: 'At Affinidi, we believe in the power of collaboration & innovation. Thank you for diving into the world of digital trust, decentralised identity, and revolutionary technologies that are shaping the future of identity management. Reclaim Your Data. Reclaim Your Identity. Reclaim Your Self.',
    webinartitle: 'Customer-Centric Data Management Solutions with Holistic Identity',
  },
]

export default webinarDetails

export type WebinarDetailsType = {
  id: number
  webinartitle: string
  webinardate: string
  desc?: string
}

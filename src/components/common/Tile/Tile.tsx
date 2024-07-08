import { FC, PropsWithChildren } from 'react'
import Image from 'next/image'

import * as S from './Tile.styled'
import Box from '../Box/Box'

interface Props {
  text?: string
  icon?: any
}

const Tile: FC<Props> = ({ text, icon }: PropsWithChildren<Props>) => {
  return (
    <Box direction='column'>
      <S.Tile>{text}</S.Tile>
    </Box>
  )
}

export default Tile

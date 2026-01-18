// フォーメーション定義
export interface FormationPosition {
  positionName: string
  x: number // 0-100%
  y: number // 0-100%
}

export interface Formation {
  name: string
  displayName: string
  positions: FormationPosition[]
}

export const useFormations = () => {
  const formations: Record<string, Formation> = {
    '4-4-2': {
      name: '4-4-2',
      displayName: '4-4-2',
      positions: [
        { positionName: 'GK', x: 50, y: 95 },
        { positionName: 'LSB', x: 15, y: 75 },
        { positionName: 'CB', x: 38, y: 80 },
        { positionName: 'CB', x: 62, y: 80 },
        { positionName: 'RSB', x: 85, y: 75 },
        { positionName: 'LMF', x: 15, y: 50 },
        { positionName: 'CMF', x: 38, y: 50 },
        { positionName: 'CMF', x: 62, y: 50 },
        { positionName: 'RMF', x: 85, y: 50 },
        { positionName: 'CF', x: 38, y: 20 },
        { positionName: 'CF', x: 62, y: 20 },
      ]
    },
    '4-3-3': {
      name: '4-3-3',
      displayName: '4-3-3',
      positions: [
        { positionName: 'GK', x: 50, y: 95 },
        { positionName: 'LSB', x: 15, y: 75 },
        { positionName: 'CB', x: 38, y: 80 },
        { positionName: 'CB', x: 62, y: 80 },
        { positionName: 'RSB', x: 85, y: 75 },
        { positionName: 'CMF', x: 25, y: 50 },
        { positionName: 'DMF', x: 50, y: 58 },
        { positionName: 'CMF', x: 75, y: 50 },
        { positionName: 'LWG', x: 15, y: 20 },
        { positionName: 'ST', x: 50, y: 15 },
        { positionName: 'RWG', x: 85, y: 20 },
      ]
    },
    '3-5-2': {
      name: '3-5-2',
      displayName: '3-5-2',
      positions: [
        { positionName: 'GK', x: 50, y: 95 },
        { positionName: 'CB', x: 25, y: 80 },
        { positionName: 'CB', x: 50, y: 82 },
        { positionName: 'CB', x: 75, y: 80 },
        { positionName: 'LMF', x: 10, y: 50 },
        { positionName: 'CMF', x: 30, y: 52 },
        { positionName: 'DMF', x: 50, y: 58 },
        { positionName: 'CMF', x: 70, y: 52 },
        { positionName: 'RMF', x: 90, y: 50 },
        { positionName: 'CF', x: 38, y: 20 },
        { positionName: 'CF', x: 62, y: 20 },
      ]
    },
    '4-2-3-1': {
      name: '4-2-3-1',
      displayName: '4-2-3-1',
      positions: [
        { positionName: 'GK', x: 50, y: 95 },
        { positionName: 'LSB', x: 15, y: 75 },
        { positionName: 'CB', x: 38, y: 80 },
        { positionName: 'CB', x: 62, y: 80 },
        { positionName: 'RSB', x: 85, y: 75 },
        { positionName: 'DMF', x: 38, y: 58 },
        { positionName: 'DMF', x: 62, y: 58 },
        { positionName: 'LMF', x: 15, y: 35 },
        { positionName: 'OMF', x: 50, y: 32 },
        { positionName: 'RMF', x: 85, y: 35 },
        { positionName: 'ST', x: 50, y: 15 },
      ]
    },
    '3-4-3': {
      name: '3-4-3',
      displayName: '3-4-3',
      positions: [
        { positionName: 'GK', x: 50, y: 95 },
        { positionName: 'CB', x: 25, y: 80 },
        { positionName: 'CB', x: 50, y: 82 },
        { positionName: 'CB', x: 75, y: 80 },
        { positionName: 'LMF', x: 15, y: 50 },
        { positionName: 'CMF', x: 38, y: 52 },
        { positionName: 'CMF', x: 62, y: 52 },
        { positionName: 'RMF', x: 85, y: 50 },
        { positionName: 'LWG', x: 15, y: 20 },
        { positionName: 'ST', x: 50, y: 15 },
        { positionName: 'RWG', x: 85, y: 20 },
      ]
    },
  }

  const getFormation = (formationName: string): Formation | null => {
    return formations[formationName] || null
  }

  const getFormationList = (): Formation[] => {
    return Object.values(formations)
  }

  return {
    formations,
    getFormation,
    getFormationList,
  }
}


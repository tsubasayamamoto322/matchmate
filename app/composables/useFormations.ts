// フォーメーション定義
export interface FormationPosition {
  position_id: number // positionsテーブルのID
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
        { position_id: 1, x: 50, y: 93 }, // GK
        { position_id: 4, x: 15, y: 72 }, // LSB
        { position_id: 2, x: 38, y: 77 }, // CB
        { position_id: 2, x: 62, y: 77 }, // CB
        { position_id: 3, x: 85, y: 72 }, // RSB
        { position_id: 6, x: 15, y: 50 }, // LMF
        { position_id: 9, x: 38, y: 50 }, // CMF
        { position_id: 9, x: 62, y: 50 }, // CMF
        { position_id: 7, x: 85, y: 50 }, // RMF
        { position_id: 10, x: 38, y: 23 }, // CF
        { position_id: 10, x: 62, y: 23 }, // CF
      ]
    },
    '4-3-3': {
      name: '4-3-3',
      displayName: '4-3-3',
      positions: [
        { position_id: 1, x: 50, y: 93 }, // GK
        { position_id: 4, x: 15, y: 72 }, // LSB
        { position_id: 2, x: 38, y: 77 }, // CB
        { position_id: 2, x: 62, y: 77 }, // CB
        { position_id: 3, x: 85, y: 72 }, // RSB
        { position_id: 9, x: 25, y: 50 }, // CMF
        { position_id: 8, x: 50, y: 57 }, // DMF
        { position_id: 9, x: 75, y: 50 }, // CMF
        { position_id: 12, x: 15, y: 23 }, // LWG
        { position_id: 11, x: 50, y: 18 }, // ST
        { position_id: 13, x: 85, y: 23 }, // RWG
      ]
    },
    '3-5-2': {
      name: '3-5-2',
      displayName: '3-5-2',
      positions: [
        { position_id: 1, x: 50, y: 93 }, // GK
        { position_id: 2, x: 25, y: 77 }, // CB
        { position_id: 2, x: 50, y: 79 }, // CB
        { position_id: 2, x: 75, y: 77 }, // CB
        { position_id: 6, x: 10, y: 50 }, // LMF
        { position_id: 9, x: 30, y: 52 }, // CMF
        { position_id: 8, x: 50, y: 57 }, // DMF
        { position_id: 9, x: 70, y: 52 }, // CMF
        { position_id: 7, x: 90, y: 50 }, // RMF
        { position_id: 10, x: 38, y: 23 }, // CF
        { position_id: 10, x: 62, y: 23 }, // CF
      ]
    },
    '4-2-3-1': {
      name: '4-2-3-1',
      displayName: '4-2-3-1',
      positions: [
        { position_id: 1, x: 50, y: 93 }, // GK
        { position_id: 4, x: 15, y: 72 }, // LSB
        { position_id: 2, x: 38, y: 77 }, // CB
        { position_id: 2, x: 62, y: 77 }, // CB
        { position_id: 3, x: 85, y: 72 }, // RSB
        { position_id: 8, x: 38, y: 57 }, // DMF
        { position_id: 8, x: 62, y: 57 }, // DMF
        { position_id: 6, x: 15, y: 36 }, // LMF
        { position_id: 5, x: 50, y: 33 }, // OMF
        { position_id: 7, x: 85, y: 36 }, // RMF
        { position_id: 11, x: 50, y: 18 }, // ST
      ]
    },
    '3-4-3': {
      name: '3-4-3',
      displayName: '3-4-3',
      positions: [
        { position_id: 1, x: 50, y: 93 }, // GK
        { position_id: 2, x: 25, y: 77 }, // CB
        { position_id: 2, x: 50, y: 79 }, // CB
        { position_id: 2, x: 75, y: 77 }, // CB
        { position_id: 6, x: 15, y: 50 }, // LMF
        { position_id: 9, x: 38, y: 52 }, // CMF
        { position_id: 9, x: 62, y: 52 }, // CMF
        { position_id: 7, x: 85, y: 50 }, // RMF
        { position_id: 12, x: 15, y: 23 }, // LWG
        { position_id: 11, x: 50, y: 18 }, // ST
        { position_id: 13, x: 85, y: 23 }, // RWG
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


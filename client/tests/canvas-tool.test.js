import { doesBlockOverlapLine } from "../src/utils/canvas-tools"

describe('Test overlapping tool', () => {
	test('Simple block -> line do overlap', () => {

    const polygon3D = [[ 
      [0,0],
      [0,10], 
      [10,10],
      [10,0],
      [0,0]
    ]]

    const line2D = [
      [5, 11],
      [5, -1],
      [3, -3]
    ]

    const result = doesBlockOverlapLine(polygon3D, line2D);

		expect(result.length === 2);
		expect(result[0].length === 2);
		expect(result[1].length === 2);
		expect(result[0][0] === 5)
		expect(result[0][1] === 10)
		expect(result[1][0] === 5)
		expect(result[1][1] === 0)

	});

	test('Simple block -> line do NOT overlap', () => {

	   const polygon3D = [[ 
      [0,0],
      [0,10], 
      [10,10],
      [10,0],
      [0,0]
    ]]

    const line2D = [
      [-5, 11],
      [-5, -1],
      [-3, -3]
    ]

    const result = doesBlockOverlapLine(polygon3D, line2D);

		expect(result.length === 0);
	
	});

});

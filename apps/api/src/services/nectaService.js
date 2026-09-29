export class NectaService {
  async verifyStudent({ nectaIndexNumber, completionYear, userId }) {
    if (!nectaIndexNumber || !completionYear) {
      throw new Error('NECTA index number and completion year are required.');
    }

    const validIndexPattern = /^[A-Z0-9]{6,12}$/i;
    if (!validIndexPattern.test(nectaIndexNumber)) {
      throw new Error('Invalid NECTA index number format.');
    }

    return {
      userId,
      nectaIndexNumber,
      completionYear: Number(completionYear),
      verified: true,
      source: 'NECTA mock verification service',
      grades: {
        mathematics: 'A',
        physics: 'B',
        chemistry: 'A',
        biology: 'B',
      },
      locked: true,
      status: 'verified',
    };
  }
}

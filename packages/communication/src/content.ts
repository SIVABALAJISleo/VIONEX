import { VionexContentReference } from './types';

export class VionexContentAdapter {
  /**
   * Generates a structured, zero-duplication reference payload for a VIONEX Video
   */
  static createVideoReference(params: {
    id: string;
    title: string;
    creatorHandle: string;
    creatorName: string;
    thumbnailUrl: string;
    durationFormatted: string;
    timestampSec?: number;
  }): VionexContentReference {
    const route = params.timestampSec 
      ? `/watch/${params.id}?t=${Math.floor(params.timestampSec)}`
      : `/watch/${params.id}`;

    return {
      version: '1.0',
      type: 'VIDEO',
      id: params.id,
      title: params.title,
      creatorHandle: params.creatorHandle,
      creatorName: params.creatorName,
      thumbnailUrl: params.thumbnailUrl,
      durationFormatted: params.durationFormatted,
      timestampSec: params.timestampSec,
      embedRoute: route
    };
  }

  /**
   * Generates a reference for a YouTube Short equivalent on VIONEX
   */
  static createShortReference(params: {
    id: string;
    title: string;
    creatorHandle: string;
    creatorName: string;
    thumbnailUrl: string;
  }): VionexContentReference {
    return {
      version: '1.0',
      type: 'SHORT',
      id: params.id,
      title: params.title,
      creatorHandle: params.creatorHandle,
      creatorName: params.creatorName,
      thumbnailUrl: params.thumbnailUrl,
      embedRoute: `/shorts?id=${params.id}`
    };
  }

  /**
   * Generates a reference for a live broadcast stream
   */
  static createLiveReference(params: {
    id: string;
    title: string;
    creatorHandle: string;
    creatorName: string;
    thumbnailUrl: string;
  }): VionexContentReference {
    return {
      version: '1.0',
      type: 'LIVE',
      id: params.id,
      title: params.title,
      creatorHandle: params.creatorHandle,
      creatorName: params.creatorName,
      thumbnailUrl: params.thumbnailUrl,
      embedRoute: `/live?id=${params.id}`
    };
  }
}

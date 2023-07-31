import { groq } from 'next-sanity'

export const wahineQuery = groq`*[_type == 'wahine']| order(id asc){
    _id,
    id,
    ingoa,
    korero_pukauae,
    korero_wahi,
    whakapapa,
    tohunga_ta_moko,
    wa_tiki_whakaahua,
    whakaahua{
        alternative_text,
        asset->{
            ...,
            metadata{
                blurHash,
                ...,
            }
        }
    },
    kiriata{
        ingoa,
        poster{
            asset->{
                ...,
                metadata{
                    ...,
                }
            },
        alternative_text,
        },
        droneFootage{
            ...,
        },
    },
    wahi{
        ingoa,
        ahuahanga{
            lng,
            lat,
        }
    }
}`

export const kaiwhakaahuaQuery = groq`*[_type == 'kaiwhakaahua'][0]{
    _id,
    ingoa,  
    korero,
    whakapapa,
    paetukutuku,
    whakaahua{
        asset->{
            ...,
             metadata{
                ...,
            }
        }
    }
}`

export const koreroQuery = groq`*[_type == 'korero'][0]{
    _id,
    tuhinga_matua,
    whakataukii,
    tangata_mihia,
    tuhinga_timatanga,
    tuhinga_timatanga_english,
    ropu,
    tuhinga_whakaraapopoto,
    mihi,
    tuhinga_tauaakii_whakamaunga_atu,
    haerenga_korero,
    opening_video{
        ...,
    },
    opening_video_poster{
        asset->{
            ...,
             metadata{
                ...,
            }
        }
    },
    opening_video_korero,
    opening_video_title,
    tuhinga_whakamutunga,
    "kaiwhakaahua": *[_type == 'kaiwhakaahua'][0]{
        ingoa,  
        korero,
        whakapapa,
        paetukutuku,
        whakaahua{
            asset->{
                ...,
                metadata{
                    ...,
                }
            }
        }
    }
}`

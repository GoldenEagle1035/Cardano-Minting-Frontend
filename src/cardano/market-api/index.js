import { utf8ToHex } from 'lucid-cardano';
import { mintedCollection, setMintingState } from '../../store/collection/api';
import { waitForTransaction, lucid_user } from './helper';
import axios from 'axios';
/*
export const sendAda = async (addr, amt, mint_count) => {
  console.log("sendada,", addr, await lucid.wallet.address());
  const m_addr = await lucid.wallet.address();
  const lovelaceAmount = BigInt(Number(amt) * 1000000);
  const tx = await lucid_user
    .newTx()
    .payToAddress(addr, { lovelace: lovelaceAmount })
    .payToAddress(m_addr, { lovelace: BigInt(2000000 * mint_count) })
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
}
*/
/*
export const sendNFTs = async (addr, assets) => {
  const tx = await lucid
    .newTx()
    .payToAddress(addr, assets)
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;

}
*/
/*
export const mintRoyaltiesNFT = async (
  policy,
  royalty,
  recipientAddress
) => {
  const { policyId, policyScript } = policy;

  let recipientAddress_array = [];
  for (let i = 0; i < Math.floor(recipientAddress.length / 64) + 1; i++) {
    if (i == Math.round(recipientAddress.length / 64))
      recipientAddress_array.push(recipientAddress.slice(64 * i));
    else
      recipientAddress_array.push(recipientAddress.slice(64 * i, 64 * (i + 1)));
  }

  console.log(recipientAddress, recipientAddress_array);

  const tx = await lucid
    .newTx()
    .mintAssets({ [policyId]: 1n })
    .attachMetadata(777, { rate: `${royalty / 100}`, addr: recipientAddress_array })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(policyScript)
    .complete()

  console.log("royalty tx", tx)

  const signedTx = await tx.sign().complete()

  console.log("royalty signedTx", signedTx)

  console.log("royalty policy", policyId, policyScript)

  const txHash = await signedTx.submit()

  console.log("royalty txHash", txHash)

  return txHash;

}
*/
/*
export const burnRoyaltiesNFT = async (
  policy,
) => {
  const { policyId, policyScript } = policy

  const tx = await lucid
    .newTx()
    .mintAssets({ [policyId]: -1n })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(policyScript)
    .complete()

  console.log("burn tx", tx)

  const signedTx = await tx.sign().complete()

  console.log("burn signedTx", signedTx)

  console.log("burn policy", policyId, policyScript)

  const txHash = await signedTx.submit()

  console.log("burn txHash", txHash)

  return txHash
}
*/
export const multiMintNFT = (
  policy,
  collection,
  mint_count,
  price
) => async (dispatch) => {

  console.log("multiMintNFT");

  try {
    dispatch(setMintingState("Initializing"));
    const { policyId, policyScript } = policy;

    let i;
    let mint_info = collection.MintedInfo;
    const inputAssets = [];

    let remainAssets = [];
    for (i = 0; i < collection.Count; i++)
      if (mint_info[i] == 'A')
        remainAssets.push(i);

    console.log("mint_info:", mint_info);

    let remainCount = remainAssets.length;
    console.log("remainAssets:", remainAssets);
    let temp_minted = mint_info;
    for (i = 0; i < mint_count; i++) {
      let rand_num = Math.floor(Math.random() * remainCount);
      let mint_num = remainAssets[rand_num];

      console.log("mint_num:", mint_num);
      if (mint_num - 1 >= 0) temp_minted = mint_info.slice(0, mint_num) + 'B';
      else temp_minted = 'B';
      if (mint_num + 1 < mint_info.length) temp_minted += mint_info.slice(mint_num + 1);

      remainCount--;
      console.log("collection_type:", collection.Type);
      if (collection.Type == "cid") {
        const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${collection.CollectionIpfs}/${mint_num}`, {
          headers: {
            'Accept': 'text/plain'
          }
        });

        console.log("ipfs_res", res);

        inputAssets.push({
          name: res.data.name,
          description: res.data.description,
          attributes: res.data.attributes,
          dna: res.data.dna,
          image: res.data.image.length > 64 ?
            [res.data.image.slice(0, 64), res.data.image.slice(64)] :
            res.data.image,
          date: res.data.date,
          compiler: res.data.compiler,
          mediaType: "image/png"
        });
      }
      else {
        console.log("no ipfs");
        inputAssets.push({
          name: `${collection.Name}_${mint_num + 1}`,
          description: collection.Description,
          attributes: [],
          dna: "",
          image: [`ipfs://${collection.CollectionIpfs}`, `/${`${collection.Name}_${mint_num}`.slice(collection.Name.length + 1)}.png`],
          date: "",
          compiler: "",
          mediaType: "image/png"
        });
      }
      remainAssets.splice(rand_num, 1);
      console.log("remainAssets:", remainAssets);
      mint_info = temp_minted;
    }

    console.log("temp_minted:", temp_minted);

    console.log("inputAssets", inputAssets);

    const metadata_assets = inputAssets
      .map((asset, index) => {
        return {
          name: asset.name,
          description: asset.description,
          attributes: asset.attributes,
          dna: asset.dna,
          image: asset.image,
          date: asset.date,
          compiler: asset.compiler,
          mediaType: asset.mediaType,
        }
      })
      .reduce((out, asset) => {
        return {
          ...out,
          [asset.name]: asset
        }
      }, {})

    console.log("metadata_assets", metadata_assets);

    const assets = Object.keys(metadata_assets).reduce(
      (out, name) => ({
        ...out,
        [policyId + utf8ToHex(name)]: 1n,
      }),
      {},
    )

    console.log("assets", assets)

    const metadata = {
      [policyId]: metadata_assets,
      version: '1.0',
    }

    console.log("metadata", metadata);

    // dispatch(setMintingState("Communicating With Blockchain"));

    // const txHash_s = await sendAda(collection.RecipientAddr, price, mint_count);

    // console.log("===1===>", await lucid.wallet.getUtxos());

    // await waitForTransaction('send ada', txHash_s)

    // console.log("===2===>", await lucid.wallet.getUtxos());

    dispatch(setMintingState("Minting"));

    // if (collection.FeeType == "Royalty") {
    //   const txHash_r = await mintRoyaltiesNFT({ policyId, policyScript }, collection.Fee, collection.RecipientAddr);
    //   await waitForTransaction('royalties mint', txHash_r)
      // const txHash_b = await burnRoyaltiesNFT({ policyId, policyScript });
      // await waitForTransaction('burn mint', txHash_b)
    // }

    // console.log("===3===>", await lucid.wallet.getUtxos());

    const tx = await lucid_user
      .newTx()
      .mintAssets(assets)
      .attachMetadata(721, metadata)
      .validTo(Date.now() + 100000)
      .attachMintingPolicy(policyScript)
      .complete()

    console.log("===4===>", await lucid_user.wallet.getUtxos());

    console.log("multimint tx", tx);

    const signedTx = await tx.sign().complete()

    console.log("multimint signedTx", signedTx);

    console.log("===5===>", await lucid_user.wallet.getUtxos());

    const txHash = await signedTx.submit()

    console.log("===6===>", await lucid_user.wallet.getUtxos());

    await waitForTransaction('multi mint', txHash)

    console.log("===7===>", await lucid_user.wallet.getUtxos());

    // dispatch(setMintingState("Sending to Wallet"));

    // const txHash_sn = await sendNFTs(await lucid_user.wallet.address(), assets);

    // console.log("===8===>", await lucid.wallet.getUtxos());

    // await waitForTransaction('send nfts', txHash_sn)

    // console.log("===9===>", await lucid.wallet.getUtxos());

    let formData = new FormData();
    formData.append('id', collection.ID);
    formData.append('minted_info', temp_minted);

    console.log("formData", collection.ID, temp_minted);

    dispatch(mintedCollection(formData));

    dispatch(setMintingState(""));
    return true;

  } catch (error) {
    dispatch(setMintingState(""));
    console.error(error);
    return { error: error.info || error.toString() };
  }
}

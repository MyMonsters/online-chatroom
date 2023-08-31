import apiFetch from '../request';

export default eventHandler(async (event) => {
  const formData = await readFormData(event);
  console.log(formData);
  //   const { files } = event.context;
  //   console.log(files.avatar);
  //   const formdata = new FormData();
  //   formdata.append('avatar', files);
  const token = getCookie(event, 'token') as string;
  console.log('token', token);
  return apiFetch('/user/uploadAvatar', {
    method: 'post',
    body: formData,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
});

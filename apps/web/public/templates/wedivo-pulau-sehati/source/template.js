
(function () {
  "use strict";
  var DETAIL_TEX = [
    "data:image/jpeg;base64,",
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/wAALCAMAAGABAREA/8QAGgAAAwEBAQEAAAAAAAAAAAAAAgMEAQUABv/EAEEQAAICAQMCBQEHAgMHAgYDAAECAxEEABIhMUEFEyJRYXEUIzKBkaGxQsEG0fAVJDNSYuHxcpIWJUOCorImU/L/2gAIAQEAAD8ALNnV8dFmPPo3lotvmDpW4dOt9f00TJNtX7K6ISv3ivEGSQ1R61dXVnvrMiGATkxyvDk/8NC5O488CrPNn3rgHroI9zAyFlaOE7HjjApkv1Gu35ewGsywoH2gwmZd26J1Fvt2mmBv6ijzZ/PTsbyMqaJVdW3RWJWN7iNpNkWBz2PTSWdsSWO9pZX3gFL2k9VBr2/1zr0s1nc4UGNqjkjjNuDZJq6Pc/Oo5ZSyGNsdXhlA2OjEE30Q9gRVH66ujIxyfLZ1WOQCJ3q2UHmieLJ6H40eOkEkbwRFVlgk3NEwIKixZX9e3vqfcu14RW4oVtkBDUfT6eh/L2+dVReUsbWRMBQKsxuMc9gKI7USK1NmRpIYlkwJ8ZhCCplfhxzyD9O3Wm/PVDzwyMyAbZsegJUKUQRw3sDXFm+ToZkEEDZYO7zSrE+UAASwIvjpZ68DuNZ4VIEnlEscKO8bG0FEsDxV8FTxxVk2dI2Y8GPOzKDGJDLKiBiq+qnCMvWrP76W0Mg8tzKjY7kuhJPI/wCYnre49Ls1p8KpAi2PNXeSaH4ST1AsGuou+4+dHlFikCx4E2O4jYo5ry5STQN9jfS+TrMnyMh48lJHx05AaQsu4UCeD9SAffU2bw/38Kh5UKYspLVz/Sa45AvnveheDIY1kgBpEO6xRQdj1r29+3vq6WRoJUydjW021hvpnJH4eKuiLHIutIysqUJLjESozOJSyUxJ",
    "B4PP4+w57fTTsN5YDjnKj2zFmN2aFre3/q44+nbU0TiISJOVCo48txJ2LE7fcjrV8fS9NGMBkRqkYZihX0yEMj/BFdRf10zzYVhdgv8AwwsYVABsJNHirINkfn8jU0kUuPOmDCjBCwuSI79rqAGBB/pC0Ofy0ZmjxJMfIj2ugAjCs2wSHqK/9J4vuONdDxSM5uOwhMkP2mVHk3biRQ4ArtfPHII51DkI0aRvBks2O7NR3Bg1cE2e4JB9Q68+2nSSp4ji4u6ZaC3ISCCWU8uSOhA46AEke2o0ErTtFkQSwrjIvoUWHSxsKnrYHtx1vVw2+UrRRjLIcgONxZmFELdUbF1zfPTjWnIMOdkedgPiyF/UsrWoAFEq3Qi+tdKOpVim2ZGRjOm1iv3ZkIAYn1MFPA9PfvWl4RhkmSXYsBiJ+0qoajXNrZN2dvTVSCLJYueUiNqsagNGb6Eews8gfPOjyvDY5383GRtyjbNuTaSxu7IAHPPv+2tx3aLKRlkjgyGTaciRAyULHQdzyPzHxpcsMoSPHkjRchCzmIkFTYtuPzNUeOdTz5LNDFFhTMyma3mVg2xarbR4PY37G+mnTvshVZZVlkUFQhY2VutwvoBX0NcddF5v2CDzspdymHy5BsUsw6An3F8fmdLyTDlxnJT7uNwpYoreo/HPyf0rVOLP9h8QiCoJUmjKFd5BKg/jPFA8gH+NHMqLJFjRq6RpHsHqKMqnub4Y97r21zc6VyjzY+MzAhYsgrSupqlIvsDZv6Xr022CUAFiYw3mMy8MSQLA72Dz8i+NPxcJsnAyVLs+R2crv2EG6PHa+P0OnvkyTYsavFGsuOtKxtgVI5NHqf8AM62XGNCJiPMkK7jEi+mmBBI7hTfT9dQwZEqZGTJKkM2Y5O4hWAZOgbnq3B44q+L07LCT4W2DHkiZHcGUGt4INH+OfjUMeGskzL5oaiOCD6ruxXcHt+mulleVkYkkf2DK+zyShRkKL8uxyGH0Bv2v",
    "trEEUYjjbIZEsHaz+kniuBfbbzXHHbU+HijNZppnXzYztjRVqm5Nnvz8/wDfVmDCviEYeMkmOFXMgLIr1Y7j8XBPtz7HUAMkuOXCkKjiQgx7WIv1cEdjzY69jq7EjDZXlSsdkz+WHIC+ofiDX2IoAXyQPnR5kr47uIYGjcSN65G3BiO3FVdE/QjUmMwMggAXd6JAyKPwsK45HIPHf89bK2R5CZccSyyRqTFHGWBK87zRvnrQ62dKhkhXF8ycSSSygSIJVA4Uk0xHfgDjmjzrqeIEZeNJOsRjkyNnmLITxts0pHAvv31z8NN+DIyqEmcsS3mD7sgfiU9RRF/vrorlHNwBkRo0U4gaNW3EpRA9Q+a9+v11FhxCBI4b8wwEECVzsNixwwsVxx31LmrmRZKYo8mITAOJCLKCyKYA+9/6GtxZFwoJY4gxnVGAhZ9tsRw19gOtfOqMOOR8Ro8yd5UkjuRXABP9JBH4e31HXuNI8JE/2bJ80DfHIu5JD1odAT3FUW5/y9NI8U0jugdckDzFBH3Zo9RdE8Afvxp0c22aF4CjZMM58yHYbI57Hrz399G88atJ5abWyVsRsCbHeh7nkfH6aTkYMsuK6oUKRBRIGHJXsBzfPHJ9+OmlyZDDB8rDkl3s67mDW8KjrwfxE8/ofbR5GPkv5UKOt06Gbbfsefjk8jizpUMwx8GePELGfyyixl62E16rPFD26cj40+D7xEQymWa94coQy8UQQDV/H69tHkyB8UNLjDews7GYjcSRfsKJHS/qL0iNVEyrO0MqqtA8Eq3Pv0B69u9apiilaBViKkWfN9Y4Y9CLPHXgdBY63pcyYsMwSeTMKLygI5UiwSR05U1XTnreqoV+246BRuxlW2iLKdlE8VQ4JPF39QNQb3jz088CCV7SKQJu3AX6PVwK4PzZ+pCXHyYMqVpmtnUiyKZA1KSBfWvb3OizMmWNkxY/Mn+0MkRLSFpXUk1be93fYcdtMaZNsPmTnLZx",
    "Ujht0u5eDyRdgE8ex15I8hJXUyKVMYaOItyztfB44W+3sR1rSV2DIMbxGLLRrYBiNyn0hxfHuOBp0ccX2yNVjLNHIXZWYAsKPHt8Vpu8RtPiNDHRRXQmUlYOBfQdCQT3s68GWJ/MyZvQ7LtZZBx/1fIDDnRSY+/GjOTRdgwEqchyO3aqFdfjvoQuGzlMXKWXH8o7tq8lyeVI4sn+2mwwmNS5bY23bI8MW4VwALHQH34rS2TGyMWLHOUkjROTIvKlBz0IHUgkfN/GpoGf7Uxz4ZYFxdu+MKGBA/Cy/QUD2699NwMd4pmERD+ajPGDw6i7IF9BVfhJ4vQBpkycaSTeVALs4YEbeAQT2J4o9xqjKEWDNLKLjkinFlSCNvXkHk8BrP5Dka9nQjKyXlhEcrqQII/wjcSCq9wRxu5PFgamwckU+XN9ojklDRxoyjdG3Fi+w7888aRhyxrlLlZL7fMIKswKqo9m55+v/jTM3IcQDGgL+vaWba33fNkMeKH/AH0wZ1zxRSRxpHstbUlXZbutp6Cuvt+mnTo0uZ5wZEZgqb0oKiCtoqhYIPbkH30N7AuRIvooK6UzgKeHNdiKBHvwdXZqRu0UmPLEcdrWADctFhZthzu3Vyb4HXXPilx4ZtjO0zKAwja7k6+kHoCCb9yBoPCciZyUychxI4JdWobepqujcHi+oOh8Lhl+1Z0CDYsUY2Iw3KqX6RyeTXI56duOXSNKMtZggDOhjaIPytfhuuvfqPrpp8QxsXaskdRzSBo7RQBY5uunXjvz8aBoHMbtCgpA0wjYEUvUjqTfUUOBWp4o1zS08bp9lnP3yhdvrAN8HoKB51RHCIUnDxLvchHAewi7eOnue99u+tkF5SqMKbBYRBFSVQVJYXan5HWuel+2psqZpckDGBWFCU82VQdpI/CR1vjXss5TZECsvkpExKux3KSR09+nPxY1bKzJFGcgbSZCSAOVXsb9rPa+vGpc6RNqyyxpPgIwLSoWsMP6",
    "/Tzwdv5H8tJk8OmSI5JdmLygRSWCrWB1610rnVeNHCEossxC7hGzEEkchuBfHB5q616aPHkxnfZ5CKxjDAj1E8j86IHf37aSscsoU5KoZkQEyxSbg5JO2vbg9NPxZpFgQwF8idYWLAybmRjVKL6LwBt+b1NkFcYqVZf963CV1Ygqpsg0Rxbc19Bqzw2Rop4Z4F88KD55Dbd99CR7ijxx11KviofOjxdskU2NM8kkTXcm4nkE8GqoDvenP9nfGaCQrGZXZopE7pt6MO/P9+upGjjfCOMuWkc5oGKYkCyQdo7ggWefj6abMZIYYY4ZnUmM224Wpu9hHUCyaPsfnVEOSuRgS4xkDMJNu0qLKMCBGK7ckDixV6llSaOaLERXEEjEpOp3I7AU4N9iaA78cafJJF5DZGMzBYFX1SHYU21Y4F+oEg3/AH11PPTImScY7JNIu/ZJRVCoNlevqo65JLw4qmORSpKMsauCUBJ5Fnngnj66Lw7LMckkM2RuMsTbS1H1dn991dbNUK50cuc0cyRxHDkiYDcUejF+9V83xrHTGjgZ3L+ghZTE5pCfbuOR/fQXjQruxstxKv4tzljzxRoWR86TLh42TKZTOyzoN0ox5iyuP6Sa60fp1F6dEsQjx3yM1plYkxxrSxuQb9Xfr+uix8ZmWeSfIV49oI5NI4PIBB5v8tB4f5YMjYySNPMG35EyF23X2XsvudKkR2jlPiHhsePEtIzRTlgW91HYH3rVGdlKkCNDGXiFIzCTaEIApQByTQA5IH8aZhxspkigZnyJVLNLO5bc98BVPAAHe9KWOR8tl8RwVxo0Kr5sMxKM46UKoA0O2gbIx0cT4kjTBifNilJtDyDwO3HX30kQlMmcYsyySzIfMVlULQNUTx++nEJNDB9omDSQur2BamiLHsaBHI/8gkuND55yc2KFZH3kYxrlvfj4/XR42OmP4hPJJNItpvJMdgHtxxfBv50EqwNlRRMXeZJSAyxjbsB3G/g3",
    "ej8yLGUNn5CxIJRKgisBj0o8cj++icyvlSlMoSSlAXjKhRwaFmgAfk6PcZmiczFpo2BtQCCoPI54IAPUfpqCRMFJJ3y8iKORXYjyCVpm96Hv363q6bGxYkGJCm+XyxKfwqtjlSeBzZJs8nTIkmXGx5jkMXVxudCCDz6gb4Irv31IJ40Ej5mSYo3Y8w+na3TaeOOnbVkz47l4JMwCV/VtIon5FjmvfQFJ5lTIKRSso+7kL0WB7A16bGixp2Eksc8a4Y4kchlZjxVcDpfc6DJ/3fAnzY8gwZe3zAxVFkYBgpJB7Ue/7a9PJPlsVgfw95fKG6ONrcAHkE9AO/xrxVsaJWjASeQXIlhrvoAALIXoD0NaTtkkSXIzZhiwBWdVeXdI4sDcw7Vftp22bJMc/lR5BRqSUNdV+L2rpVcj8tMG2FpFMUGFFNIG3mRQZmqqAq64/bWSvjuXhkzFEz+raRRPyLHNe+hcZ2WmO+M2FlQScSbZCsigGiR0ANaxPMxcl4slI8eNwREG4AX8u/a9RvkTNPIcssFjA+zsYFoHj26g9xQGr/tMc7xSRwzbWdAXWjQPFgEUVP6/OocGBRHkRYZlnUyFyF2rdE0bPbkiudOinlikcmpHoF2kiIR15JXk80B24vtpWQY8j73EwJY3yW3NLHQG4kdSOx7Hka3CmypmUpcsu1twjk2qo6BWPwR1A79NH9qkxXLSFHdgNxaNijLZtbvnp1FC+2qBLFkbMhMZ1E8oZzH1FmuQeCD76mxx57T+XuzWFqpZUtVvqCeg5quenOlNk5H2sPkqrxxsDEJYQFoda2m+R8AWOdXRSQuyZMGK8f2iRS7xDkWa5B4IOpYVbIjeGKSfLWJm8sWo2j4J7c1XPTRwZ0md5r487QRCK2BS2UXR6mjyD+WtbycdIo45PugAkJLV5jk3ZFUtk8dtZGksoyRL4jLvE20LjqF2gDvfbt+mmMcl/vHhLqUpVoEV23LYBPz01m5PMRo5kMd0",
    "yyjkEkUVC8Cj2154JblWTxOQtJKBEuPtBoL3B/SvpprGdUkdDO12BG22h8cHn2/LUxlxkxPs8QJ2SfdW/rDMb6D8IBPfjropGnJRVyY4nJoqpPJodB349+57aaZJMb7Q0s8uTHEV82OBRuTdwB1phf8AB0IkhxoTiDafLk+75sncbHpHKjnvpccMjq0QzZlLMBHHAQzcCyTY6WarSsY4ro2M7BR+FpQCQm57UEj8Qs1fH6atgwlgyf8AhwZESsVhVR6qNckE0aNHjSWldiJsfEfEmjJEtAbT82foODXGgyM9vtP3eTlLGrKsyyQkqSeBXzfbT5kZwkcWOJZNwG59qs1Dk9744/PQtC6l5pTCJSdo8lfTEpsksT34A/LQw53mLLjnJMW6gZVW1iJPp7HdZ4v+2qkidZWjm8nMi31FQp6PQkcAgX27aklkOQyyx4rYksdrKaG2r5IJ6dBwa40MAilxs9MnKjC5jrFuCFvLPFX1DC+/uTqvIaeS4o1M5LgBnCIWUe1dR/npCQTY0+RkNKqyzMoZYb2RAA8tfQ/678VKuIyPi48Ah2KykrQIaqrpyRzf10mHCZMGETovmQy92/5WJsfUdu16g+14sMkqyQTZbGXaBKFG5j1Iur7fFfOqovDi2VMYYTE0g2hiu6uOSKPN/trywiNIoZYmAiqRXksGlNk8fhs3QJ99Lx1SeWeONcyVhJW/aBZPtddaHxXXvq+P7LYxsXCvZuDIh2kmqrp1AvSpMSKPEVWDIY23ISQWQAkhuf4Pz01JFHGYJJMgyNYL72IB32OVuqBqua9udWRz+H0cfFxlbykLusXHFe4HYH9TrY8KM4qbdpELeYu9+QoaweOefbsb1FiCPLM4jjy8ipKEhUCn4PF1z0+KPN69kQR5OJmlYQ7BFOOoSipDeoLRBIrvomkxMhlkR2EqMVEEu7cX6fQ0L0OVkbfMkbHE+UAQke6rPPLdAuji242PBjZ2HKssij1Bt633F3d/",
    "B0wK2fKip4pkxzxNWRjyxDY4U9DXWx/OvOrY03mzTmaDJva0J4A9hfSueNAcaCRPEVnxXkWBEaGMCnA4J2kV1vpfbT5F/wBo5YWHxDKgkiap8WaMFWC9jXWx/OlS48weaTz0lhkAcMPwEXYTnp+E8ayKTMkaXBkiEkSephs2AA0VA9wP51mPjJlzXHlzQ5ak/aceSIBSy9OQLPGjOS+RI7RTB8aI0/lRbQWPAX60DoBivhAztmE5O3eqxDaVrqFHyeD8Xp6SzyIshiTzHozxHglb5NDkGua7amx8VZDMYY4Y1PCySEva9hYPJ/XXooVxZJJcqRyZT92is7soXoQO3q4vVSTZGWkLSRxs+5ZJYnFEc9fcEDmu3zxqTHxgzSRxwJj+a5KCUFtwu+x62Tz89umqoAzDy8fMkjnVzIUZiNhAA/E3UE9vnQLl5GSo82APJHMRLEw5YqeStG7rnj99JxYzODFDGkKF2liElt16mgeT1u/20R+34Ybe7rGH8yMxOWcEUNvJ6Gqr505cjJyVTzIA8isJJInHJrmxRsGv3/LSXnla4jEQYjviRmtkB/uLPBBvjprRiZEGe5jj8vFRQzZG8Ww/5VN8XZP6jQZ8yeHSgCX70hgEisEg/wDMLO7sL7aZk4sb002KkoYAtHbWnNjkcV0vScJJJpJnw42CDcPPKlVu+iG7IJJ0nO8RixcqHym8pqZXhjc3JdWPk8fUavzElMWJNjtLi5EKgFYzu2DrzxR7XxoMWT7dk5M0isyMSrTOCI2PQbF731/LWZkQxFL/AGWSaaIeuRRQawOf/VxzWgONKPKkyERgDvaBFuiavca6HgGtAuXkAzZeNF5sUNhnlV1Qi6AQglq59u2nNJGkqPGMmAAlSg43A1e49+n4hoMlcSR0WMzsqSKjJDGCVsi7PvVH/wA6zCnIjyPLiyTBNLuYSkOpU9aVuR7muwHfVKZCLEiwvHjvKailSOo6Jrb7/HvfOpsrIEp8vIM5",
    "eJgqiBztB9z2J5uz066KWSOTIjDO8scJWlikHpU9TXT3JvnjVCyxpjxiCaKKRztilEVKR0o+3t1686U6QpHIrTvO+4LK0jXQHO1KFdSOvJ466miychkZoY3MakEl7XzL+vKgDkgdtWLMPscKpLDFI7VHIse2PniuOnt9edBNKpSTzWCyA+WxRixCgE0tAi7IPPwdJlmM4Dpvk+zShAiuQoXqT7dyT1PGntJ5kcMaZEcEDOoiNFlIB4s9jf8AGpTkO4yXUu820xszH0WTx1rsBx88dddLJzC0EiSrEYkVkKg/qfiqHHXU4RMbw9EEu6SNtwkTlTzagg8t2FjnjQR+djRPJiDGxiwHplJLnuRQ6++q2EgRJYIzt3GOQLCJCe4PPTp3HF6Q8sUODtYSoVJLFYwTwb47A13+msgxoooNqiNQ7etsgnvZ/p6dzWjys2PI8uHKd4YFJKmNG9ddfote+ixlSDEaGPbO0T2GPpBG615PUgVZ1PjfaIsdp8RcTHEjUpcsdw5Pb3AvTc5t0B2N5cFBrBYGTjk/T9zrMfy8fDSMyh2ikALKAFPNr6m69rI5OtjwyqvtjxPKY0eWPPJrjr7/AF0HhXg2Jl+FRNLjQOgRWS04PAH+vfWf7KwRKsf2THCsTaiJaruel9tKOD4fHEUGJEpFkfdqR8fX/L30nG8Pw5o7jw4WZnY+qJeBZ6WP20Q8MxhHs+zQFWX174ge/HQDSm8Exhn47nCxkM5ISMIKIoHp766mR4Dgw0ww8a3on0A8/T450EeB4cuO0ksEZfdS+hBu56njVQ8NweWGJjqqmzSoTzfTj6a5OJg4EmTJ/uOOzedIVOwVW726cVqhcDCa4Z8HHQFgLES8Ht276DK8DxJnaKLEx9ore2wcD3FDrro+CzRx+EQKs0YDxilZl/KvrpU00KeYTe5BzJ0C88H5+uuZJK+TEqyMrK1AIAAf+2qPB2WPCMTLyZXIUEEgbiPrrzzSY0chZo18wgqA",
    "oNmzf76aribLwU8wgGRzQoEEryb+n7Vrp5s6SKGd0ZRQbaAff29+DqRZYtvlCNrNHaeT0q/m+Omp0yMmFmZip3cheBxzfP5DXLx8zdkHbOARLINlg0dx46f6vVq5O/LJ3q42218N8f8AjToM0vkM3nKGV/Q9Dg9P9H4OqYfCfDDGki4OKjgbnURJYv2sf37a5EvgeKPEoXOHjjzmYImwEMKBuul66WT4B4fEQ4wsbc9EnYOv0+OdDHgeHpjtJJBH5m6k9CAtz1utefEgWck4MATcdp2gmvcGtITw7DdQmThY3lm2JEHK/IPtrcrwPDJ8mHDx2crydgHH9tD4N4BgzQSxtiwOiOy7igskM3F6fJh40IaBMLDIJt2aHdVdD/bQS+F4EkCSHBww5PRIQDY62K+mpsHwLHi8TaNsXH3lA7LsDBOWHH6DV2R4H4fisyrh4wA/q8tSf3HfjVAyU5KAKEsMD/SLuj34/vqRJBLl4SCTavmuVCkWCV639P2rXUzZ0dQ7ujKAA20A/wAe/B1IssRURrE3NHaeT0q/m+OmlREMxbKVRVMBdgnkCtNYlEBWMhXJQ7qN8cf699SjM35JVmUBdp/CPSR2P+u41b4LMEgnkadbeaUMWIoncbYfnqXNyfKygrKCvBJNBR04+eup1zX9O5uHc7VIFlfr+daswZAfE93nD7vHWjwAAGPBv5/vqrOljZ9zkOGPAT344vt3Go0/w/gtjLM+HjbhyD5YHB7/ADocbwzAWbZJjwpEo3UI1peeg47++pJ8PDiW1x4Ahs0I1PtQ6f6+dL8L8Hws4zs+JCy+YwsoARyePjR5HguCrgfZILBAACA3+vsCNKm8I8MXxXFjx8eFy6sCGUUx47e/XXVyPAsGIhlxMe3ok7B1+nxR0uLA8OTGZ5II9+6k9CDdz16VqoeG4JtvsmOqqbPpUnm+n7a4/h/g2FnTZhbEgK+fILCAEcnj4/jRS+CYCMo+xwcEAARg3f19tJ8S",
    "8I8LTHyPKxoiEQHfQFG+tDnX0yyBcRYfNQki6YgtyOnHPzqFZ4VttpO7gswpSSKIroNTZKo6GV3EkdghWU8C+dM8GkTHGWzTRopyJF9RAWr6iz/qtDkz44kIkdS3spAoEfXn6aWskeR4ph7Goln9SUP6euuvmzpIoZ5EZQAG2gHt7D34OpFliKCMRnsdrUT0q/m+Omp0nyYmZmKndyFFDjm+fyGk+BZkSjK35EaFsiRSruOLPb5+miyMrG8xhvVnA/pb8II/f6fOpvE8lZcOYx7PUp3Nx6hwTX112F8KwFJIxMdVQ80i2e3fn21x5/BcZvE4ZTiY4M7METaCGFA3XS9dHI8BwYqYYmMS4BPoHX6fHOlp4d4YMdpJseFn3UtxoC3PW61RJ4ZgiNnXCxlVDfCIT17cfxqLH8PxLVJMHE5sqBCBR7c130vIwsSG6x8cKSeFjUjtXYf699b4Z4ViTiWb7LEV3GrQA2O1101s3h2K0iq8ELWwFBRR9zWtXA8KiySYMHFO2vxIpJ9+CNHJ4P4WsJkixICC3A8tbBHX69P51NieB48XijRti4/mPHuZNgYKLYcasTIyISzyMhDc1YHHN8/lryOJcvBQSUPMcgCgVJXk39P2rXTzZ0dQzyIygANtAPH5e/B1Is0JTyxGex2mielX83x00iPIyoXLFltjYAr5/wAhpb5L72UIylWtmAHTpX663xJKRSH3KKcmug441ng8q4WI4eTyyzyLQIPG48/XQjNgeQAESNR5HHXuK66HMynlYmA0wJLfT+3OibMCLEquOW5BA59/p/r302BxJn8SFtmNShSAQN54Pvz/AH1YcLCyB5jYmPsHbYl9/jXIxMLBfJkIwYGcSyFPQKrd7dO3bTX8OxwxCYmOUFlgsakCugqh/r31smPCkpmTDxbVQCWiBr4vTfNwpYm83Ag9QHBgB2nn47Hprn/7Exft2NJ9lxvviwRQgpuAbroD/GupkeA4MVMMPGt6J9A6",
    "/T450hvCvDJMZnngiL7qX7tPV89NPg8D8NiJkGHjUvU7Evv8fTnXP8O8GwcyfKd8WAqJpACEAqieP4+NE/g+CjrWJjg7gAFjHP6jtp8fh3hkWQxixYmZQKIVBzfXkaOOfIgJJKkN0UUOOb51y8fM3ZBqcAiWQbLB53Hjp/q9XRZStOR5m/at9ar8v30eFMjKtbSoJVQF6+1C+v8AY6HNyaUMjBWQbSGN2T2vTVcS5eEnm0PMc0tAgleT+n9tdPNnR1DvIjKAA20A/sPfg6kWWIqIxGex2mielX83x01Ok+TEzMxU7uiihxzfP5DSvA82JPtLNOiMZ5FKs60LPUfP016XNgeZlsOwHO0/hsf59tUgxyH1RsZGolRV/X5vjSdkM6qwwIFVQAVaEAA+3T9/bQDDxRMzNh4pRmrmAEkcXzXb30ybwrw5o3l+y45a9pAjFgj8ueANSQeCwQ+KoDi46ySIW2KoIADDprpZPhmLiSKBi47KxsnYCbrqPb6akgwcUlVlwsQ3ZX7kCj25rodLmwcWOwuPj0SeFjUgVVcUK/110zFwML7KJVxIizuxsxLfB6AnXmxMVVYPDjvzyCimueLsV01QnhuAFXKOBhURuVRCnI/T6ax/DvC8tkV8SBX6rUan6jp8d9c7xLwXElx53TEgSOJWYuFAIoWAD7ca6EErwyBxVBeAxskdP7aHLyZPPdAtyOPS3APvf6aWc8iCM7wHdgSGA5PF/kNOx5EbxHGBn2qkMlchdnqBN3+X6a6GZktJIrxvG2+1bZRIsdu3X+dctMlwHQxFWH4jQJA4FX+un5TCNQWe0C3YX+k9j+f8akhLR+GiJmRaeQcN33nvpj4zNGGaQRpf9PVR9evTWvk7ICqyqFattv1Px7+/6aVFlj7UNjrSoCwoWD2OvNliTCyW81QTFIt0KZa5/b9jrz4xj/w8fLmZIPJtkCgnpzTHkX3/ALaLxLE3+CookC4pRW8pVqunAPtovGMfZiQr",
    "JIXxxKgERQdLHBPUjWeJYhXIwxkTGaEzhUj2Ba+pHWu3TRZ2Mx8TwI8mYy2zBPQFo7T6j7n/AFWgmxJF8UibIyDJIEbYyps2EVRAHfRLjSjxoNLOGm8o7GWOgosdr50MWE7eNTSGY/avLFSbeFFnjbfTR4GNKMzMk88HJtQX2emq6bb6fneveF4joctoZyspmO9ygYNwO3au1fvofC8Z/wDZ8rYs3lv5zhy6Bt/PU9OdBh4jHwh1imKK27eSoJY2bN9j+3xrPtDH/DKxupEzQAKACwPHvVazxTMWPwQY+4faEjVSgv456dPnTPHZ2kwoY1Q+d5qWtHaPUOd1VXzrfGZ3llwVhjZpVnVmVgVAr5IrXvEsln8TwZIkdwjkspQqQNp9xyevA0t85czxeNsd1kx40YyOA3HTpxyfcdtEcxT41vQmSBYSGdeQPUP1/LWY2eh8VyJgS2OI1XzQDQNn9R89tF4bmq2Z4hILbH3LTgH/AJfaunzr3h+euMctsomKKWUmKRgfVwOCK4+L66HwjK8jw6b7TUSySu8bMa3C+h9j8aXj5643hHlzBlndWMaUSXsmq46/HbVyFR/h1R0UQi/pWleMNfgfB/oH9tVeKH/dY/YMp/caT4pIfNwFJIPnrp2cay8X4b+x1kzhfHMersxNf6jQym/GgetRX/8AkNDA+7xici6VE4/M63w5gc7PIH9Sg/8At0eA9Pl2TW8/wNB4OwPh8gH/APY9f+46yBv/AJPIeapuf11K+L5f+HaimaODyOYwoJ6dmPIvv/bXvEsNz4OvlzKmM0at5QjFrx0DX0v4OveI48n2GNXmvFDKPKK89Rxuvp+/zpniOHvmwhPJviWVdiBdp71ZB5rWZ+NK2biDIn81N/oGwKbo8kjqR+WinxGk8ZgeeYtKI28tlXbt6c13P7fGtXGL+PkTTM8ox7VwoXZ6h0H+ehw8QHxnMuVjMIkIkoAgWeAOlaXg4zDPzfKk25O8XKVuxt6F",
    "eBWi8PxZN+YVmHn+Z63KWG4HFXwB2/vrfDMOSPCl+y5GxzK+8um/cb61xR+nGhwsVj4O6RTFEbd5lqCWNmzfY/t8aybIEf8Ah8Y7sPtPkhQgBO7jqOP/ABrc7LVfB0xiwOSqonli+vAvp0+de8WyN0MGPAA05kXelkBKPc10+dF4hmLNkYSY7CSQTAsvIqrsHjg6zNzEmz8M47CZY2LSFb9I2m/z+OvGvSZqyeNRPCwfHijYvILrmunHJGvfbF/+IPtEZWTGWHa8im9tn469Py17AzFbxXLy9wGOUWMSc1fJvp07XofDclfteZPMRHC7gI7EiyB+wPY6zCz48cZcs7iOKSU+XIbpuAK+Pj30XhOWI/D3bLdIhI7ul2LUnob7/Gl4ucMfwgpOpjkbd5ai2Lgkkduvx21cHDf4fWyQPJBP6aDxRq8IRuapP5Gn+LSD7LEWNASL/Ol+JuFyMMnn75QPrzpmTIB4jj0eWJI/TW5DgeLwc8lGr9tAxA8UX2Ed/uNZgSg+LZdXW1P76LDZTmZqk82tj8tFgEMMwGzUnb4A0nwk3gv1oO45H/UdBE4XwmQm7Ksb/XSTiMn+H1SGZo4Wh/4YUE9OaY8i/wDVa94nhkeErD5oGLtBESoBXTgH2/fR+MY5TEhWSQvj+agERQdLHBPUjWeKYtZGF58pliM4CxlAAPqe+iysV2z8P7RN5pBIQhAtGrvjqf2+NemxmfxrGSacvJ5T+W/lgbDxyB3OvCB28Y2zSK0yQ7kk8ugPVX4b9tZiYTDxXJfzqyCi+sLwBzxt9v317BxnbN8QMc1ZKuu6VowdwrpXYfQ694bjyq+aUmHnmSpHKWG4HFXxXb++s8NxJEwpfss+xjI+8um/eb69RR+nGgw8Mt4Q4ilKKd4e1stybN9j+3xrHyfJ8ASGZh9pEIARATuscEe//nWeJZRbwePHDKMzaqGMm66ck10+dF41kNPBBjxUcjzF3obAUgi746fOt8Wyjk5O",
    "FHjDe6yh3BBGyux4663MzVk8Rwfsx86nO4LxXpPW+/xrMnLvxvFliVnWNHD+kihQ9xz9NE2an+2DMhWSBYqlmU3s544HX59tD4fm+Z4nlZO5fsm1UElHryb6dOvOveGZe3Mz55SsUEzBUZrF0P2B7HWYWekLZckpCQySnypLJDmhfbj499b4Tl+V4e7ZbpF5kjul2LF9Dff40mDxAY3hBSceXM4YxJyTICTVcdfjtroB93+H1skAQi/pQ0HijV4Qh5oBf5Gn+KuPssRY0BIv863xNxvxNx/+qoH10rxCS/EMFRzbsf8A8ToMxj/tzG+In/Lpp4avFlq/+GeB9RocGWvFstOeFT+DrcNl+2Zq3Z3LY/LXsEn/AHzk8P8A2Gh8IcN4c4/63r/3HWREN4IxNkjfRv66lOKV/wAPhIpjHjtD6k22enNMel/novFMEjwnyfNrFUD7sLzxXG67r9/nW+MY+zEhEkhfHEqARFBVWOCepGt8UxqmwUnlMsJyFCxlAP1Peu2sycNx4piDJyDNy3lnYF2mrB46n9vjRZeKx8TR55S8mxtjKNgTpzV8/noRjTf7ZQzTh5hGfLZY6CcjtfJOtxcNv9rZMhm/3kov3gXgDnjbfT99DhY7nM8QMc1ZKuu6Rowdwr8Ndh9NM8PxpiMuSKYLIZCHLRghhQri+K/vpfhmHJHgy/ZZ/LYyPvLpvDG+vUUfpxocLGf/AGO6wzFEbdvtAxY2bN9j+3xpcuS0P+H0gko5XlBQiWd1jqPiv050XiuWzeFCBWT7W21SlmgTXPTp86LxnJM+PBjxU2R5q74+RtIPckcC++veLZRycrBjxqd0lDyKQRtrseOutzs3z/E8Q44M4j3F9vFCvnv8ddFlZqSeJwNCwliRGMzKb2Djn6/HXQxZYk8aeVWDYyRUZRdcn6cjjr217DzL8Vy8hioxdqoHN9eef/T86Xg5yw5fiGRP93jSMoSU3VgfTgG+ui8KzCkWXLkOI4pZ",
    "SYrBB4AHPHB6Ee+j8Ky1iwH+1ssJd3dNxqxf8/GkQ+IJi+D+XNcc7qxjQgkuCTVfPx21eJA3+HkJJ2+SCfpWg8Tb/wCTo3NUn8jT/FZB9liLGgJF/nWeJyjzsNWvmVR+fOiz2H2/Ds8liB+mhlkH+18dFJtlZv415GA8aYX6vLv8r0WO4Hi2Rzz5a3++sw+cvMA6mr/TQ+ESErmCz/xm/tr3hpVsSWjdSP8AregxnV/BnJPBViD+uqMOQzSTysQWMzMx9rLam8RjjdllQ7kaeIgH41ZNGr4GJISd8Kbwa68ka5SByxdGHlNkS2oNV6tUeJ+ZHHFKCKa1CkHg8c/pqDxXGaTw0zXbK5bgUACNdXxPzMfwbDEirvAVGN8XwPz1P4Y4l8RzhKxfzFU3fYKBxp+VMUM1i7YAV7Fl51LmRpNZvdMQAdx5oVz/ANtcvElyMnwrKjkdnjSOREQ9vU1dO16788cKeIpPbGdBIGWuK2rRB/IjUXhrSqksa2wMrWT3AJs6q8WVlwY+CG82Ppzx/oaN5ifCx8wcf+7SPB7+z5IckVkS1fy18aj/AMSTypjCKIkM9kVzRBXt+eqxAY/CZQ7M7BHZifpxr2TM0/g0LM26RQhb3Fsv+WkeGXH4hOWv0owr2O0caOeXzZkZb9EsSNXF8jQ5kRhmSaghui5PAFVoP8IRLN4dJNdiaOU7T9TzXvq6eQtnrEFO4o9kVV+kCv30EEf/APHZTGRvkSfn2O5ufnQeKyCTDie2KeYjcjrwTpcmeqwtCoB2YiuPzcjTvClIgebaakmlIv231pc0ccmdDEQGqORiL+U1TnssOJksz0BE/p7Nd1+epCgaFEjagwWk7kCjf7aPw+IQS5vWiyV9NnOmTR7o4olrd50Jf67rP86l/wAU4+VOiwQ/8Jrs33saf/hHdHix4JibcibS19S24cV9NbJK3+2eYgojeWMD3/Bz++gjdsf/AA05jQuyLJSgdbY8aLMSRsSJZI6D",
    "OpK3xyvTXPkgJyMkeVtP2EBaPAqQ8a6vgn3nheUhYIyMwT03dvz30uTERPGPOVnLNjuh7f8AL01nivhinBLLKyKzDcHNkkC+P016CPfjKTxs2npWn+HKXmzUNgmSMcj3TQYmLIoEjNuEmUhU3d+o39Omulk+olfck3+w1J4IzrE5UDzVfaL6Eh2GpZmkOfC0oXdIZWeul7Y9URP5Xg8gQqeXW2NAeom9T5UhMGMWIJMy3Xf0nTlhAmlayT5BXb/9/wD31F4LLIuF4gpjpo5mYGwBW7t7/wDfUvhmZLk+NmOV2ZEgYgsQbthza8dtdrOdnjyEP4Uh3C/lR/lrPDVUeGoUYSKy2GArqdLxgy5GUI+T58Z4/wDSNVYaFseAXyMoE8fL9NUMwaGI7TvNMG7f+dR/4dRGZiGJd5WY89Kkav40nxBL8UxYQO0x5P8A0rrYVIwJ2rnzX2rt3A8muO+lzJ5kWIW4UTLwe/B1U6kZglVgY+UIBB5u9c+DFDXlLlVDHkZKSQKf+KSaFj2H66Vi4+Li+J4aY8MUavE1lBXNXz+muhmygS5Srz93V+1LrYwmD4ZFjquy0VvboOf5/fQ+HsjZGZ33TRX8jaNUY42iEHvOvNdOW/z1QK8mBSOdgIIGo/8ABuL9mOfOTbvPI4PWltq16aNn/wASxMCtKklFuALC6GBy3hRZK3+sDuLsg/56XPIqYkB5JWdTQHJ4bRpOhimWNlNvuBHPSv8APU+Ed+PkRlRTZ0gA3fPsK+dT+ImfIy4FxFKOd+wr0QAde/Hb89dKSNvscmVJEyTSxv5gk/FuH04769lxtJgxyNQtdvPXkD/LSPCYmOVnFr4ljP8A6vQPfVdEtGDuASVACeLPsP5/XTiyiOJSwEqgejttqv5r9NB4Q4jXK7fjNXfVjri/4kSfJzAmO9PbsRX4lAUkfxqnCnGN4V94T6JJ93f+sjtqSd90CxstjzNp57Uw1BHOqQ5IUDaZNvXpf/8AnXQx",
    "LxcF52BCR+JSqKQVzVc386blDyZMHytxUiS76kWDqvxqLIbJzd+Wn2ZcceVEEIIbaNxY1z1Fc+3sdYpY+Fx+cQhUqoQdr76Z4T6s3NS7HmRnn/06i8Tz2gzsRfXzIr0w54vr+ursF2yY2kaM7LUbv14/fSvD5CsuYPgnp/1aWw8/x4GyuxpR9bVdDjHzHKS1W+R2sfJP865hmIh63bGjfteuH9oJlMAS933jPfXqtfvr6iKMS+FOkkalm8VohlHWh+o07LkR2wljVUdPMIFUKuuurvH0ZIGG4yKUUgs93a3x7ce+jyIgCVbkoFW/fga5+EJXzvEqZooY9skhjJ8xwqfgUf666DLgR86GeYb2lk3KrEbo2CiwR3FfvrtwyxxxxRrIio3WMf1fP5UP11xGy0w/9oPQtDR493H+eqMVxL41KF42F/4XnXJzVmk8PkGFu81pGAYtzQcn+F0pEZ8WFmILM4J/MHXJLRrlPFX3itu6f09P/wBq19dhQGLwhW4avEZSu4GrB69P763JkbZgRtyq+YFA9qvQ+KTNbKUvZBX4r5C66mdW2aT02qKxrsOO3tr5jw7LmPjOc0TspjYMKPWk1T4z97/iPGkUn/h3Z+UQn+ddmOZIyu5faunT4499fOeKFZYfENsDUx3FlayQJRxR766mApj/AMQZJqh6yPzA1uOFE862AEaQAlrs2w6/nqTYGjSFaJMqiz368fTXIlwanmkICsjbKHAIrd/Ovr8RS3hqFu+W7Hg/H5aj8VdYkx3ABALKWr8NitF4rDK0myQLA5VrO6+BXPT211poahlG70GOju6dNfLf4exCvi2czi6Ab45T/trqTojeL4/oBXaE5Hbao/nVeRjoInc1TkAE8n8v11wI234+SruQSnJPNevXTPHj0wAUBbB468ab9kJ8SzUIpFmc8fDMaA7a5+bDsXy1Zhc0YFdeuqBjInjGIrj/AHeWNmfjoK23fc6fiEjDOPMfLaHKlZUJ52hh",
    "z+41P4khlSFW7sxNflpGXlN6myBvpSgHvxz+fA13MuRYfD8cSyFI5F2u9dOBz89dcTwPIyJ8/wAUfJVEX0rHsNjaFoH5sUf8tXZKyLnNIgrYD369BqXInzcaAQ5vlBGJaHy7Np2B+bvXIxyzYGdIVPCsB9A3bXdlCx+PL6txdGLDp0r+x1mOEEgSVZIgq7RJIygdLojjdZ5snr+4ylocAx7fSACaF3XAJYGyv1IFX20mct9gaI480ziwFRrJLHgV0KmzVjRCPNYOY5UG9ED2QSt30uwPzPHX5LFyJxLOgjRoFcRt5bVQ23+GuevsK99FMMlsxjDCJMheTDZB2iwaPI/T50qSeeOOWIt91Gw5WQSLuF0TyTuNj9OBoIceQ7gXeKMARvX43ayfSbF3YA79bqjVeInk4+0mMzpGS8tbLWwOx/qPuD763yzGsiKjKkjhikp53KD614DMOvSv01BL9soB4p5QJz6XbrfW27dua44s9dbImVLku6wyLkcMksiEnnvuP50eBxxp2SW5xcVJhdlhCNzsV5YjjkAe3H11sc8eVk7WUsZ1YqpUC+nCqOL+Gok9NG7H7M6uXJi3qmQ7hOPYljYHJ4Aq75rShkZkML+ZLEoSNVjAHpFj8W4DrRPTpzVdqosfp5+LGSD5agMHYjr6RfBJs0b9/YaQZBKkbZHmRyMpMbbAWYAbSOAb6Dk9PfUyNLCXEhx0dYiFF9yALL1wa44P8jRGQoymZRaxsEYRq1G/V6r4bju3U6ujgZWilBCuql/XKaHNihXINVzxz9Bo5wjPBKYjC7qJF8lgGHHJ3DpfTdVdenOp8xyxZcZlBCkuqVvJUEUfnr0688Hv6OUqsU06+YreoBYgd9DqtnvYNDpdd9eUJCGh81vKctW1raNq/qABsEnoLFccamkmlhmZoJIYEnkCKzL/AMNuT6QQaPF/H62ck8i5ASTHORGWKqEZiY1Knt15N8D26jnWyrMzSSY8e0EejaWYEdCB",
    "+nY9/ro3yJxHIr4qREuAE3AMvuzWepr247DnhUOTjsnmY5lVbKsu6msm9vPpUnjkmz2GigVcpdmPLt8kEbYR6lYEVdk+x69QB01s8+ySJIKya2sSFfcTzdEmhyOg45+dF9pkeCMNinYSxKwHdsTqF72TfPc+405U+y7WEcwkX/6bqSCpobdgX0gcDngVoXaBFZk3eZEgUxqu0Ke4ugwH14q+dRGWCTzZHaM7HIlUBrAH4Vsmk976c9NOURDzEpfOIBWZVJKEWSFsj45F/wCRSY+PmSL9quOUlBKQd/8A9w5vp34H5869jF4JZIfNjjPMkkk7EuwPH4geL4uidBFKIslZHdJhukjGxij8jkgdh1B/Ptpv2mGaD/eIUJZQUWKmIAAoKByeaNnpqh5IcrckrDJLIWkAO0EBfwsLO4gnn+RRGp5lZFM2WFikMdbRHbAdBVC7rjmxz00e+RUUTbyFGwFXAAYjgKpI6dOKvr31rwYsPltLFBKq+iq5F8+kXXJ68m/y0eJL9piRchGlcAFEDgFlB6Aj8XQHkfmL1EkTTSThFhjVZAGYJ6lHADccHqOOas9dJllEKhhIrm1IKguWPC3xRLFR7n6ca6jSyRRxMyFQvqljJ3MQx7EAheK6UfbSZcbfMsqIhFsLUNdUerWtMOhvrqeVMa1RwjmJdxkMoteTXpHBbkdCRweOlveKSoYWclZIwsMLcksO7jr+K6DaRKsIyE+5WGJmBdI3BIb4FLtII+p7adFkx5cogln+zxFDtEalQzXwBySDV8aeyxksgMQgVATMrENHd8dh1qh/I1FmMkhTcN2zdbFipbaLr8IHJb/vpEAaMAF4xjnuDZctyF7kfUV05PGnYcJnQynEjWPZvZoXAjJumG0HqOBd/l31VNJEHj89/swRdgmoJS0SBwKI+p96OhkxpUudaNAEzUvTvR7jbXBNjvp8cc7QzKFImBtZHO1V4tgQfcV+KrrjrocN43U+VI4RoyfKF7lP",
    "crQqiexv40mbHkxyUx2npCm9vNCSDiuL4Bs+/f660QqmHHEgf1yACN+XV93ReSAKPWz9DROnTRxTTqWjlaVDtVgQVuzyG5HQUONp+Oplmw3bcz+hi/mySEqpZ+CKFfiPArkg86DFba9xk+WjF2O9jvc0FO4D68Ac0OurDDHJhTM1M0f4t+5WShZIF8fQ1VHqdZST35gNCPaqyBjsF9SOa6kk9OneyQmkI8xYzLsQ8BgStE+mwoJIv59xfA1EctcjJCyt6Y4ihRI1YqP+rj1HpVn6Vp6yRZiK0K3jWTblxuUXS8dATxto9TqyJYpsiRolLSBRIm9zuYdAOBwOQNp6mhdXqdCXWTY53ysXEUMzItAknd6TwBRIqxu/Ic6RhmGcl5jHGxivc4VwaN8UFsWv5+x5o2GCHGEimGONfQkalXF3ZB47ABuPUReuhBPktEmQ8pDknZGEoFbO4AHizS12Jvpqe2xZCIjULpsaGSrANlQasnp1rm61iQQTwK0UwjWYlQwYXMQOBR4PTknpt6DVC7kYGPFDxmIwI0akHg2x7Ar147mh20GPKI5lQWpf7mUbwG7XzuLFeovdxXQ62PHmELwlFBgLbFINgbhY3D0jgCwbN9eL0mPGyoWCKUkSHkq8nMo6kGgbHyOPpzrCcMOys8YAj3M7g7QRVdACSOOvP15OqtxjzUmGLvkBIZohtdnK0ACvBrv1rn3A0FSLhyLEEBhG6SBxR2g8HoSBzXUVdcVpWQVKLLko2xbLlmCiY2CK3n8QN9f+kHT4VJaWkpljqURlaQDqLqjQ6DqSe3QAblcuiiNZLMMi83fHBYdRY6Ue/N65+VA08TTs24sVSIsjg9+UUmye/FVzfN0MEswjRtnEX3bhyxCbTTAlehHeg1X310cOOJIX8mJ4qSh5sYXkm6PFseLJuxQOpsqObcks0U7mQbuAofgcMtcCj2N8EjudLhh8kq7wShG9bLCrFFIJ4AXuSeaH9tdAYsLVG22O",
    "ip8yRt4PctyfSenzyOmlsYMgoknkhKAVnC71AauBQ68AADk6LH8iOBYT939rRmCsrFyD/UzdRVEdjdDnRI8ku54vKaOVdilyo2gE1TG/UeRX1PtozJ5KeajMrxJ6020ARxYJFAHj2/Kq0vBaTzWTy4ljIal3FgB+KgpsD3JNdtNibHjBhDWzI7nzFFdqqro30B440pFMcMVrPI8qbQ6FiCBxSr2YCwK5APQjUbYcCLGFEcMLnzGkkFUehX1diNtcHoe+rU2oS6MsSutAMKAQryaXktQv3XuTQo2jbMBhy46cncwQHayAcW3X9f8APXoosdZZAVQZDIZC8ZBNke/I60OlVqbKhRV2MivKCLZY1KqG62bBrqeORoZMTasMLJ5SEfc+YWZ2XiyRdoeeKPfmr1SuJ5nmTzSrIrivOULzV/jJur6DrzfuNTb4Y4pHxVSLKASP7sBt1AUQCK468CvnRLPG0zEzFCU3hmYqvsCexJ73+Q61Pj5sq7EjkaVfOHmAAkSXztPHBHtfS77aqhabJMryY8RVWZgzktbe9Ec0D1ux2vT2lx4WeKQmOIRkFZFBBckUOgpq7D2Jo6leYPi4og3S7RumWFVj3DdQDXwx4HHcc99U4W2YM0cu2Td94FAcvR4sECju7D279dIeDFjaWOVQWHq8xuWJAsAjbRIIPfjnRSoYHgRoHcsAN0lgnj3ANnqeRdXzpJwFaUoyzyMd9Hyx6Iif6l62AQOgvr2N0QyFxHNKYzCrEF0b/hk9hZBsXfA9/rpbhzG87ZDjG4TbJ+Mk/wDJRFr341PkQ/ZxAJppAC4Z1tdvI6qKsA9xdiqo9wmbAGOrx7vxkQ+eOL3bi/HIH/k+2tyULZAkDMIlNEiwFNek0bo8nk3x7c6KJ/s8sbtPKuOZrSMbhzuIs0OQOfi7HbVTrlYk+37pwSQhYeprs30INjgiveu2myyuJ3URSNFKbIk3EKnG5mB6N04ocE9OdDtRovNM06CYloyG",
    "+7Zr6AE+oAUK456cakyViM+6F5wiSBZJU6EVzdjvQBHNdu+n+HzswWOA+lmIAEYG/it1jj2FGhweRXPo4Bsc4jlnK+pPKBkHJABAI6/FVfAPOsy2ZVEayRxTOfLch9tqB7rdVRNE2dY08gy5BHLBZ/HtiNMQKJLCyT04IF3r0K5UUvmP5kMQJADkL7GwTVEfA7D51PlZBOS8rlpOqrtZiWJoNd0VscX0FHTcQPNkJO9wgGiS4cspoWxHBO4daFAc6fMckOZCEn3272hKt2u7APXjuD340tJsrDg2MYI3sKIzwWYgCz1rjsQOnXS1xZXO/FWHIJCqwKguDd9CKq7JBuq0czM1wybJHSzvbeSOa9Jrm+m0/rpkMeQMYSz+UQ1hle22UKo1wK7FQD7139jwmSJyIIvNBFM0tyXt62aFDj5onTllnmVj5ollBLGOGgwayFsA888n+NToRFkO+RPGkm/aERADuJ/pYC+OPYDm+laRloJIxjkGKSU0QpX/AO2+wv69wdZiGaSIeZkrMUJR1UkAbeAB8VQ/XT2ghLInk+Y0Y6Oxr3IU8Wf7anlyZYWeSTHAYtuaFGbp8rya/wBca2KTIEYGLDIgdiKv0jte7qP16aaqJmxyDIYwyrLbRrGxKMR78cE6uwsozTxxz4kUaeWRC4X8JXqT7k2B0+NczPmykgMcvEmL+P0b2ZSTyKIB4IN9ePjimZTLjRzzY5+1yuJFlJFEVyNoPRjz76B48hT5OUzKVA4Rlaq569wKJ/Prp6YfmR/akLyRGYR714uQC+56AAc6TkM0jtEEqKxTn1EfkPf37awIuTOHEcUJAKkMDYri7PHGneTIWYZMibZFD7Nhoi+CPfkGj37aXjT4ZkkfJjn+zeUySGJthB4INdSOOa76HxifMhyzJjq5ijSjCzOrFCLKk0PTx+2mmd4IVjE8RRCGeMkUeKBrmgNx7/PbRQ5k8kmU0U2MyEhhJPtstXYgDihVdq1LMTkZURSN",
    "RLXmcSXtPBrnrWqJ5Z8bIWTMkhn8xAyvE9jryBXAPxwNKBkeUPAszR7dpW9orqBQ+t1799MEUk29TD5UfUFGqqrgi/bqD+2kSSxx2Y5UVfLIDkAiIiqv59uvvosvxabHlQywAQqAkjxLfHYj2aunHFk69GMmdxjrG8pJSLayi3JJ5J4NV/On5E84CSSzeZGE8sK5oEL/AEq3O4Dn9+ToMXIGVKoxY28xQ34EsgdQQT16Ecca9capJH4tPM2RLtViCGUJ7tzzXtfbXsqLFwZJcYGOBljRo8iUbioJIJr2+nvz8a88EWOWjd2kkQgoqguFA6qxs+o8/S+2lYsshhQQ/fMKt6DUDXQdL/PVOSIoY0dg0+UWpxLRV1AqxXRuR1Gp4Q+3b5bRzm14G1wOvHHB63z+Wjed0kVJmhEZpQzSNuHF2b456f216SCFE9MTGOtzKwIRhfUgDkVx0vU4M2XkTPLIm3IG1VjiUbP/AEgc8/rzrfFJpWibZeOhQB2KANGORVn8P1u6PbU/ny5kKQTSJI0o5EXpAYcbR+VUB207w25x/uPnwExFipdmLKOO4rg9x9O+qGx58iQxMMiSk2qWbiQnooI4vnqa1ublSY2divsE7wMSPOdaR7pjsrp1A+dR4ZRlilVsrHMhtgiUQSQTzXCkjgjp2HbV+R4c3+1JyxlwvWsscZk3pGWAFMCSRYJYn/LU2NmrgwyxtA80s34mYB/Lq7Zark8d9ap8+PcHaXJSQkEk0ykVt97+deZpSwjynMbqyj8Kkg+x/XqNUriNceX5szxzSHYyj0kjqADzx6uf00oThpaWNNkfIkbpXsK7/wDjW+IRmVXlwY5sWOaQqsciswBAG6j1PN9NSYeTNjowdYoZSHW1FupUcWa6nr+2ul4y5mfw+OLIafGTHby5TAU5HGwjv1NADoO+pDNDSxQzfac1ZTvd5AUVQCKWurciz8cX00zGgxlgkbJbbKAqxIdv39klgaPpA+fnrovO",
    "8yOPI8vy2RmRFVwpF2OB1I69r0mIFGU4qRxTRAs87nlixI9Smx8X/c61crynkTJ9ZZiNwBthXUbuoBvg86ON8gCeRIJJ43AYtI3Cdi3PF8Ac9q40CNjyRq7rGJTTfeDcGPP6ge2hhmEcMKtvPOyMwpyCOpbv+3OtmkQEIIgCKcM1Iqnry3b/AD7a8IIpvFcc55aSNfwRKW3K3AoEdz/bk6paDDiZXWOmZrl3jlevCgXz056/S9KxWaRPNvf92FdFBRSB2YcbqsdDqVsZFyYfwnySXBdSFTuNpHJH8cfOj2LEVadYAGl3OqA7mF8bbPHBHt/OjiTFy5FX1bE9KLMSSd1nm/8AXz30UbHHZ4k3RbgCJTILU9CR9a6DpWtmkjUskMKSyMRuvk+o9VHazfxoZ/LWfZGIzsNs0bixxwO3Q1rBFArMZVO6xukjYOrfoKHfrzqnHy40dWmDZMIjLFEcB3Y9Bu+vb+e5xI2RHEIp8c5EibijEB/TRJPbnnjvftqH0VGg+0MHB2ESBgdy8gsenPc6YPKRUnjiZImfbtjYMQa7WL44PH16VrcLFXNkWAM6uxJQNLVVybboP7m/ropGMMEQx4iSwsLI4Ao3QP6/+dAskcT+fOziTZXqAs88VfSv00/MilzoE8RyZCmNKm1ZKBLBeNrAexsXWkBFgjZmjjlYLYFc9r59hrEiXJbbHLchCmMeXxZ/CbH6UffvoJMGWeOosV42LFZAw3NuB5KnuOK/zrSM7ATEihXz/LVkDSOBvBFkXwfjtqvBfIw45ExBGEZwTI0W0g88UOfmxpUsiNkySSOEO/kRKSysR2s2QOu6q4HOmJk4Ph8cJU7o8gKWRzyeOVAC9TR56E6LJz4oykeO6RoiusZUbbYD3PuAvQe40wmMIqu6GTapZWJ2t71XUfH10nDyTFE+1yrL1aIXuI7m+/U8a2OHzmQxCkG51VU9Qbm/r0B1qLGEki8VyZxkykIQOY0T3au3xpjYkePk",
    "Sw44muBAzFeTXvx8dvn50aZS/Z8gskkjjaYzGCPKF8lq6k1V9r7aXE0iBjjZbLED5iwj10QOR+YuxYHbQ5s0+W0WBBjpPJKAtNax7Kr0gcWfm65A6aU3hU0DmKlxMYyqqkMbvpV9+fbi/jT28MacEfakuFCJgq0Wv3HVug56dNY+BjGKSNchol272CBl8tuoQDuPiyPUNE0ROBiXPHIAoKiNd9nqQSRY79eLHGkR4+MW8tXZ5bG6nBFUDVdSeSL+NXY4KPG+Skr4wLCRkUCQt0oX88e51PBkz5SFMXJcMiEyAIQW+nsL5/1yD48+VKYmE8pCBRdDzL6AUKJ5HPF1r2aplyRBI7FZCCxO0NuXiq7C+B9NTfZZ5MqSNJZEjh9LEMT6tvz/AH/LWHCz3d8iWMqikEXJsJHHXjuCOuqs3KhjDwLhPBKCFTaRuJHBBPNcX8dRrIz/APKJYZlcRD1xneq7AKoc9t3x00Phs4RzJuVcg7lk3k7COpYe4PzWiUSSM80PlRqy2HYhSoP/ADUeo99AiSwM64qM6oT5jsgsnod3Y3oghp5Gl8s0AQVIH6jrxXXTo5kVS/4oljO0sxBDMeB7AdPreo5pHlyozbRQn0iNI2sMb5NcVRvr2OqZS0cELJ50+S0hYl2AVV5ACgf1kEEkkdO+pFXeknkqTlRFU8tiVM//ADDiwtHvd9evXVDfaYlR8qGOPHnHlhwtqhBIAYjnlevTr176A+IS46QgzzTcUivH5ist2BXuPe9XY2TjZcsE2VAmSqSs8sOSvqAB4pT6aIYkDjkDrqaN8pJngxgggVmKAghI1Jo3Qvi7J9vqNYXWDMZFdsiFCLnCeWXAHIQLdLfbj344vJ4kkw45xPG4M3lNAsnqbg8gC7Fe2jy8iWaLHiZPs8caokbrRZl45euSf0HwdJnyg0kjosgij4tgHU9ia4IBv9tMxMjEyJHaWOSTHrcY2ABr4NUT0/Xrrzb8gqsCSh1N0sldOCR8",
    "0fr10xY5jtVo0F8Op4O0nuTz+fxpdQxOsavueM2UvddV1+B317PnePBxhFsymB8079pKsp7jiwD2r3HOkzvLk4X26OaSJ3YbGlYJfPPAr/qJ71wNUbHgMsMkavnobAayAvPBJPbk/TnWPCHx2+2LEYxVhXADD2+Rd6Lw6DCKz7/EJ4EZwYSF9JJNHax4WieRx0/PQHGkGBFOsxkeNxGExzVNYFEjgn/PXmxY4I5nZXkMjMJArehiOtVxV9/j415oVyIY/NlchPwtIoVtvyo6gV171rUSGNAHVx5nNXYA976gddESUxl+zx+pjup3v45/P39/fTceWZMUwyRwCMO82+ZdrK20jap5JBPA47fGoWyolaOWlZH/AOUndajoTxQJrg9u2m4yZWZNCWJxoYV+7iWGkayetgAm7/X6abiedgzReWfMnEwkEU4LqrG69gTzfx9dTyKYch5nOPGJJklC+WdsdDsOeLA688nqNWSvNPkSvPEHEzF90K1d9zfPbp8d9TtIm0nHjjaRwNiuLs1VC+AeT0Hf40yDa6qsTqMfYil3ayrDggdqo/2669mzuc3EWeCKelcOGIWz/TR6XwOb6E301ioEVYInZUJ3OG6UVHqFDkWKIHIBHzrzSq/iUEORBEyxKwkBWhzyCK4rpz05I54GvMkce+CDdHHGhDRkg+WQbDKBQJPvzyAK55oWQmU+U6tFMoIElDcpuqNe6nj686hxY5o8KZlCJkMrIrAkiwwO1uAt336cge+qZp2VHxldSZHIsxm0N2SOpPSq+g17xCed4YtzR4snllTMpsxtQFX2HFWb/wAgkyGgyYw04hnKiTymj9C38jvd9+bJArTliE2TPLPj48yyxjyyrjh6og1xRo/HtWkU8mE65RSIRkRlVJLKeaAHawR7n6HS0eKB1BfcY19IZvwkFjaiuKP/AOv11mdJAMOOOTymRn53miKPQ3XAIr26fXTI5I9wEJjSZ5BIGXlTQ59Aquf71oZs",
    "afHyojzjosfIipfUbpWr2YXQvXnSHIj3Y6wRmrEiiiCTYeunau+syHizAJZdjOpWzEQCGYjcx46k9u3U3xqlMOS0iVF2sqoUJL7gDe8EniqHbUjGPftadYJkLFjHXINhiGHJ5vn30wbPMcSL5ZKj0TMXAcj8Z/5SD262dTvi5InnbFAiKxIORaxqSVKck9eT31QjxxxrETEpQKTIaUmibPHXnjnp7dtSvBNkecmLOrO9S+WoICMa3HaDfSyL506F4pJXkWMSQzuS7xqR6bG0AEGyDuFfPWjqkx7pZFfFiMOKysD36/hHHqFVwK0mJGhw0cJHCUd1OUoO5FqgwHvyb9vYnR48Ynk2ZsSSbIR+CySSKJY9xS2DffXsbzVx0VI44uCs7CyYiLJN7QLsfPB0vJjx9q4+LD5ULR7i/AYqjccVz0IqvYXenNIMWYIJ22+SHqQkqtMPSObF3yDf66PGiSFonxYxJkNcqtKtVxVf9Iogc3yRrVeDdkO0aoHUK7Ub3E9SaHU12F9fnTI8p4MiF3DVNQkTy+4XcQo5PXsbPPXUDYizNDisFhbdeRcQLGPuCelf9XHudNylPnzrjsMaai9IwBdfSSLP4gQQePy0hSreLvBFjEJC+4bybc7tu78VFTusduD00X2hJ4VOMqyu0S3AzbtzXu4YmrHHY99ZG0cbiWQrLjvJaoDa+oA3tAom/wBOPnRyIYFSB4cqA5ARaVCwP9Q4vg9SbOtP2bNw1WJmkkKHzPMmLAEsRu9rAN/HQ6XgibFhxXaOJIfJIAdPvCGb1WbNAgD8j8aDxECaKRm2b2TdFtB9O3naADz0Av47aqWFsfbEq7JAxepOd4Kj0bbq+uhjgkTNX0L5G2Oljl2GTuAaHa/40O9Yc9xHPMF3iFkeW+3qruT0HX20S5EaY/LKMjfQyIiY6rgA1+LvpUeVF4e6Y77JBBEGm84U77mIux7307dzrakXI+2xvETKAsW1C33nNA/Fe46j41XF",
    "LjyJNDFCqM8W5kjU3QHqYGrJA9u2pfEkgljUwLt8mRmaR+vIHx05B/yvSpFmOJiFEiJkXYTKNpsqw27lN87jR+fjVZKxzKuEkMYlRa3ddvdwehIAHHbr7nTcsPNjiGMLLEu2WPcu4MvNgkdb0mOOEeJu1K8MpAgVQPSdtbSwvrd0edHkvLlpEsibEIYNIAQFQnbZ+Awoj5/LW5OLI+RjuI1Bjk2bfxCWwRfHcUDt4P17JhQy7XgypQ4lCPIykEqeaa+LP0+L0mKCDH8MeN1iXIjTyUlS2AkHQBSTRFc9jdjTYVVDGfLSaWGJbZlIMka8kdeOTzx07aExss2UjSorh6Xy5PSpAos1VfHbrzprUuVHv2Rylt5IUrW40fnngdeulQ4/lJLJsmnlWNlc3QViaXvz0ur44HvoZmkaLGeRkSQEMz1RQgAAj63zpp+zZSKkccTbVALM5ZulH1cXRN86TgJPDiibIDSSb3MYlHoO2gjKOwv396HbRMrRY4lgEbJJIISSFsgD2J5rkVY7dtOki8qf72KFHylJ3Mfw8ncdnyCOe3fvqfxDGnj8lV+6OQ29isu1jTeo7TYsjv8A31W8zxsAzBKDbmdTvVb6rxf5+4PxqRscb4Pu1WSPkLCCTxYFEdvUK4+dVLjzRZLxR4hCxMTtMasQT3u+bPOtwYIZcZBLEskuy0fZtIAJo9gbP8/XUiGX7OZJh5sjZGwM/LhSBRZqO2+eK/7OnSeY/ZIwYMdNrO6cHcK2oBXQ/QVoC+Oc0ZfkgSRgNKXd9ypySGF1VkUev5azDbJO4xwoX3MZCVJdgeh4FChdWT0Hxo8zJyArYKQ/aPSHQsoUMwblSfkcj3GiaLH8/IkjVGhkgEkKeXQG2i7e5r08fW9HKEfIjkkDLOt+WipZIBNsbNn4A/ganhylMkMMn+8ZEe5/tKgs203T/J+OKrXhizSNDMJ1dvXI5dQyuv8AT6j2vn4B576sjmmjyQqo4mHAj2DkADcA",
    "DzurnvdflqZZ5sgrIFAUsyyws+2lO4hmWrBA7c1XvrIEyVx3mklEykFqcWu3kVyaHXt7aFG8rxcwSIzJuRQkMlbuOD6R7Hp8aLHV4cmTZJO0szKFQm1NctR/qJA/qr+dKk8OfHycsxSzuiu3IHAB5ING657k0e2rcsSmIzQoq4iOqlUPlqFPDVzwQee3865YivKyIo4zD5gSWORVYhhQPlg3QPI+fnjm6TfitJ5hdyrqVR2teK5IJodSDXZtBjwgGecIjQsAVj8rhB1sgk8Dr+Y+ulYmNDHnQMs0bQeWfupG3E88eo/iFHn6jTcfGmXxJdjR+SyEsqhiCByXu+9ir08ZIitFKM0p3XKBQYH0/J2jmuv7a8yy40TSPKRH6z94SGZa4O7p29xd/npGE+RHiJhsVlAi3F2RQDRFe9g88jnjvpk+PEqQzCNUkRAyBVJV263fVR9fjjRPI672WGR/Jba0KA2goHg9zbVXU21caSrTAbcvIjjWOJ/OQNuVOd3mDsb6X0B+NLxajM6xqZi4CNQA21fNX12m7Au+2q6jTJlmRUjxXgUmRvVQ/pbrXIFXwOPfWjIjypseXNgMu9WUDbweCwIoWT/rnSfDo3hKY2ezsjb12+XSlr6jbwTVflpgTy4IykBMsTeaNsQ7DpxwOCP00aSyQyxKkgV6VIwVU7rBJ4FUaFflqUKfEYMzYkMc8rB4XoEqDywo8cdK+fkDVDN5mRG7wLPjKPJVggB39EIB4PIr6rXOpsfFxcVBIkcjtAQxRDRlq7N9j19rr8ta+6ZMb7pPKkjJka/WitbL1v6j6HWzvE0A3zzhiNxaN23Mb9W0EEduOOxvWtihSkkkkWRDIwVpui7CpBBb3quTqaMRHMWDGg2ZAhiaNgzMXVedoJND8+eldNWZOEJWl8+IuuOjtI52jr69pojk3+o0gJApfZKEyXYD7slW217XZ/WtVx42SuXDG6yEPGSalIKjdRNA8e/fjjSZYMg4s80c",
    "7yoqNLQfbXN7S3Qmr7dfy0UiyPMIPIjnQqz7mHKgbb5HRTZr4NaGTFkTGnyBEHiKKrBjQ2A36QetE/F8HroZMGWPHVpgtZElM7H1PYtSoHyL7dr0MuKPOmhEsQgWOmkQG2G4gnvZAJuu406GCGCdoHViriRJA1qXZuhYj2HPHQAD407yYmwhHkp5mOsgJRBQXbVACu5FE9OO2lLulywk0fmQ7BLDEBxwSKA5oXzZ+emlPGyYxlTbiNImyGUcMi9kaydt8Cz2P563IYRzyK24ecm5kEZqPoTXyB3PF61Y42iORHATPE4LBhZK7Sq/hPU1d2Rf56BPtS7XLBY5tqSMW3uhraob35JI04KYsdIlhKmGnIbhWZuyg9aPJuq41sM+TFIJHj3rCxilSFDagUBV9Sbo89BdDU7Y2RkqsOXtk8mzIQPu5KPCoQa56/HXTi6eS7yRiSaEowvotmrFe7GvYcXpUEa7sOcxhPI2vS8UdvIv+rk9NDk4SCT71mWaOEpJvQBWYVXU9KJ57e3I1Wsb5Mkhxo0kS96BjuAIXg7ie/I6e2p4CkeINzuzekhhIVVV6kAdD1o8aYrnKx5pIUiyUSLewB6NVUD2ar/P2vWY2LJPK8OIjxMR6Sv4Iy4quTYI2j9R7aWhlPhMMESfeQgjyxLzw1NfuTyTfQj51SFQBXeSQQoX9RLWwUUoJFEm75/nSpYZYMiYFmKK5DB7bcpA2V831Pv9dZMhnx4o4jlHIkcU8cu4SWSS1H8NAUfqdLypiJsffK0caudzq+3d1oG+g4Hayeb1Sxljw5ZdkU0XYzDaAzDax966cccdNf/Z"
  ].join("");
  /* ================= CORE ================= */
  var doc = document;
  var body = doc.body;
  var $ = function (id) { return doc.getElementById(id); };
  var qsa = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  var TAU = Math.PI * 2;
  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  var reduceMotion = !!window.PULAU.reducedMotion || mq("(prefers-reduced-motion: reduce)");
  var finePointer = mq("(hover: hover) and (pointer: fine)");
  var clean = function (s) { s = s == null ? "" : String(s).trim(); return /\{\{/.test(s) ? "" : s; };
  var txt = function (id) { var e = $(id); return e ? clean(e.textContent) : ""; };
  var pad2 = function (n) { n = Math.floor(Math.abs(n)); return (n < 10 ? "0" : "") + n; };
  var uidN = 0;
  var mkId = function (p) { uidN += 1; return (p || "el") + "-" + uidN; };
  var angDiff = function (a, b) { var d = (b - a) % TAU; if (d > Math.PI) { d -= TAU; } if (d < -Math.PI) { d += TAU; } return d; };
  function el(tag, cls, id) { var e = doc.createElement(tag); if (cls) { e.className = cls; } e.id = id || mkId(tag); return e; }
  function icon(name, cls) { return '<svg class="ico ' + (cls || "") + '" id="' + mkId("ic") + '">' + useTag(name) + "</svg>"; }
  function useTag(name) { return '<use id="' + mkId("u") + '" href="#' + name + '"/>'; }
  function setIcon(svg, name) { if (svg) { svg.innerHTML = useTag(name); } }
  function hideEl(e) { if (e) { e.classList.add("is-hidden-empty"); } }
  function onceTimer(fn, ms) { return setTimeout(fn, ms); }

  /* ---------- saved progress (per invitation, per browser) ---------- */
  var SKEY = "pulau-sehati:" + window.PULAU.invitationId;
  var save = (function () {
    try { var raw = window.localStorage.getItem(SKEY); var d = raw ? JSON.parse(raw) : {}; return d && typeof d === "object" ? d : {}; } catch (e) { return {}; }
  })();
  function persist() { try { window.localStorage.setItem(SKEY, JSON.stringify(save)); } catch (e) { /* storage unavailable */ } }
  save.visited = Array.isArray(save.visited) ? save.visited : [];
  save.found = Array.isArray(save.found) ? save.found : [];
  save.quests = Array.isArray(save.quests) ? save.quests : [];
  save.ach = Array.isArray(save.ach) ? save.ach : [];

  /* ---------- guest & names ---------- */
  var guestEl = $("guest-greeting-name");
  var guestName = guestEl ? clean(guestEl.textContent) : "";
  body.classList.toggle("has-guest", guestName !== "");
  var GROOM = txt("cover-groom") || "";
  var BRIDE = txt("cover-bride") || "";
  var WORLD = txt("cover-logo-text") || "Ko‘ngillar oroli";

  /* ---------- synthesized sound effects ---------- */
  var AC = null;
  var master = null;
  var soundOn = window.PULAU.data.music.enabled && !window.PULAU.silentPlayback && save.sound !== false;
  function audioInit() {
    if (AC) { if (AC.state === "suspended") { AC.resume(); } return; }
    try {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) { return; }
      AC = new C();
      master = AC.createGain();
      master.gain.value = 0.16;
      master.connect(AC.destination);
    } catch (e) { AC = null; }
  }
  function tone(f, t0, dur, type, vol, f2) {
    var o = AC.createOscillator(); var g = AC.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t0);
    if (f2) { o.frequency.exponentialRampToValueAtTime(f2, t0 + dur); }
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  var noiseBuf = null;
  function noise(t0, dur, vol, fa, fb, q) {
    if (!noiseBuf) { noiseBuf = AC.createBuffer(1, AC.sampleRate * 1, AC.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) { d[i] = Math.random() * 2 - 1; } }
    var s = AC.createBufferSource(); s.buffer = noiseBuf;
    var f = AC.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q || 1.2; f.frequency.setValueAtTime(fa, t0); f.frequency.exponentialRampToValueAtTime(fb, t0 + dur);
    var g = AC.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t0); s.stop(t0 + dur + 0.05);
  }
  function sfx(k) {
    if (!AC || !soundOn) { return; }
    var t = AC.currentTime + 0.01;
    try {
      if (k === "click") { tone(740, t, 0.07, "square", 0.25); }
      else if (k === "open") { noise(t, 0.28, 0.35, 500, 2200); tone(523, t + 0.06, 0.14, "triangle", 0.4, 784); }
      else if (k === "close") { tone(700, t, 0.12, "triangle", 0.35, 400); }
      else if (k === "discover") { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, t + i * 0.1, 0.22, "triangle", 0.45); }); tone(1568, t + 0.42, 0.5, "sine", 0.25); }
      else if (k === "pickup") { [988, 1319, 1760].forEach(function (f, i) { tone(f, t + i * 0.07, 0.2, "sine", 0.4); }); }
      else if (k === "ach") { [392, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, t + i * 0.08, 0.3, "square", 0.18); }); tone(1047, t + 0.45, 0.6, "triangle", 0.3); }
      else if (k === "coin") { tone(988, t, 0.08, "square", 0.3); tone(1319, t + 0.08, 0.3, "square", 0.3); }
      else if (k === "splash") { noise(t + 0.9, 0.6, 0.6, 900, 180, 0.8); }
      else if (k === "whoosh") { noise(t, 0.55, 0.45, 180, 2600, 0.9); }
      else if (k === "step") { noise(t, 0.07, 0.12, 900, 500, 2); }
      else if (k === "sync") { for (var i = 0; i < 6; i++) { tone(440 + i * 110, t + i * 0.12, 0.1, "square", 0.12); } tone(1320, t + 0.8, 0.4, "sine", 0.3); }
      else if (k === "stamp") { noise(t, 0.12, 0.6, 300, 120, 0.7); tone(140, t, 0.12, "sine", 0.5); }
      else if (k === "magic") { [659, 880, 1175, 1568, 2093].forEach(function (f, i) { tone(f, t + i * 0.09, 0.4, "sine", 0.22); }); }
    } catch (e) { /* ignore audio errors */ }
  }

  /* ---------- dates & time zones ---------- */
  var TZ_RAW = txt("tz-src") || "WIB";
  var TZ = TZ_RAW.toUpperCase().replace(/[^A-Z]/g, "");
  var TZOFF = window.PULAU.timezoneOffset;
  function parseParts(d, t) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(clean(d));
    if (!m) { return null; }
    var tm = /^(\d{1,2}):(\d{2})/.exec(clean(t));
    return { y: +m[1], mo: +m[2], d: +m[3], h: tm ? +tm[1] : 0, mi: tm ? +tm[2] : 0, hasTime: !!tm };
  }
  function parseTime(t) { var tm = /^(\d{1,2}):(\d{2})/.exec(clean(t)); return tm ? { h: +tm[1], mi: +tm[2] } : null; }
  function instantOf(p) {
    if (!p) { return null; }
    if (TZOFF !== null) { return new Date(Date.UTC(p.y, p.mo - 1, p.d, p.h - TZOFF, p.mi)); }
    return new Date(p.y, p.mo - 1, p.d, p.h, p.mi);
  }
  function localDate(p) { return new Date(p.y, p.mo - 1, p.d, 12, 0); }
  function dayLabel(p) { try { return localDate(p).toLocaleDateString(window.PULAU.intlLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch (e) { return p.d + "/" + p.mo + "/" + p.y; } }
  function monthShort(p) { try { return localDate(p).toLocaleDateString(window.PULAU.intlLocale, { month: "short" }).replace(".", "").toUpperCase(); } catch (e) { return pad2(p.mo); } }
  function hm(h, mi) { return pad2(h) + "." + pad2(mi); }
  function timeRange(p, endStr) {
    if (!p || !p.hasTime) { return ""; }
    var e = parseTime(endStr);
    return hm(p.h, p.mi) + (e ? " – " + hm(e.h, e.mi) : window.PULAU.translate(" – selesai")) + " " + TZ_RAW;
  }
  function utcStamp(dt) { return dt.getUTCFullYear() + pad2(dt.getUTCMonth() + 1) + pad2(dt.getUTCDate()) + "T" + pad2(dt.getUTCHours()) + pad2(dt.getUTCMinutes()) + "00Z"; }
  var P1 = parseParts(window.PULAU.date, window.PULAU.time);
  var T1 = instantOf(P1);
  var P1END = null, P2 = window.PULAU.secondaryEvent && window.PULAU.secondaryEvent.date ? parseParts(window.PULAU.secondaryEvent.date, window.PULAU.secondaryEvent.time || "00:00") : null, P2END = null, PDEAD = parseParts(window.PULAU.deadline, "23:59");
  function gcalUrl(title, start, end, loc, details) {
    var u = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title);
    if (start) { var e = end || new Date(start.getTime() + 2 * 3600 * 1000); u += "&dates=" + utcStamp(start) + "/" + utcStamp(e); }
    if (loc) { u += "&location=" + encodeURIComponent(loc); }
    if (details) { u += "&details=" + encodeURIComponent(details); }
    return u;
  }
  function mapsDirUrl(dest, placeId) {
    var u = "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=" + encodeURIComponent(dest || window.PULAU.translate("Lokasi Acara"));
    if (placeId) { u += "&destination_place_id=" + encodeURIComponent(placeId); }
    return u;
  }
  function placeIdFrom(a) { if (!a) { return ""; } var m = /destination_place_id=([^&]*)/.exec(a.getAttribute("href") || ""); return m ? clean(decodeURIComponent(m[1])) : ""; }
  var PLACE_ID = placeIdFrom($("vn-dir"));

  /* ---------- sections present? (couple may hide some; the template hides empty ones) ---------- */
  function secEl(id) { return doc.querySelector('[data-section="' + id + '"]'); }
  function navItem(id) { return doc.querySelector('[data-nav-target="' + id + '"]'); }
  function isAlive(id) {
    var s = secEl(id);
    if (!s || s.hidden) { return false; }
    try { return window.getComputedStyle(s).display !== "none"; } catch (e) { return true; }
  }
  function hideSection(id) {
    var s = secEl(id); if (s) { s.style.display = "none"; }
    var n = navItem(id); if (n) { n.style.display = "none"; }
  }
  function setImg(img, fallback) {
    if (!img) { return false; }
    var u = clean(img.getAttribute("data-src"));
    var host = img.parentElement;
    if (u) {
      img.src = u; img.loading = "lazy"; img.decoding = "async";
      if (host) { host.classList.add("has-photo"); }
      img.addEventListener("error", function () { img.style.display = "none"; if (host) { host.classList.remove("has-photo"); } });
      return true;
    }
    img.style.display = "none";
    if (host) { host.classList.remove("has-photo"); }
    if (fallback) { fallback(); }
    return false;
  }
  function daysUntil(dt) { return dt ? Math.ceil((dt.getTime() - Date.now()) / 86400000) : null; }

  /* ================= WEBGL2 RENDERER (hand-written, no library) ================= */
  var M4 = {
    create: function () { var m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; },
    ident: function (m) { m.fill(0); m[0] = m[5] = m[10] = m[15] = 1; return m; },
    copy: function (o, m) { o.set(m); return o; },
    persp: function (o, fovy, asp, n, f) { var t = 1 / Math.tan(fovy / 2); o.fill(0); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
    ortho: function (o, l, r, b, t, n, f) { o.fill(0); o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n); o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); o[15] = 1; return o; },
    lookAt: function (o, e, c, up) {
      var zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2], l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
      var xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l;
      var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0; o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0; o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
      o[12] = -(xx * e[0] + xy * e[1] + xz * e[2]); o[13] = -(yx * e[0] + yy * e[1] + yz * e[2]); o[14] = -(zx * e[0] + zy * e[1] + zz * e[2]); o[15] = 1; return o;
    },
    mul: function (o, a, b) {
      var t = M4._t;
      for (var i = 0; i < 4; i++) {
        var a0 = a[i], a1 = a[i + 4], a2 = a[i + 8], a3 = a[i + 12];
        t[i] = a0 * b[0] + a1 * b[1] + a2 * b[2] + a3 * b[3];
        t[i + 4] = a0 * b[4] + a1 * b[5] + a2 * b[6] + a3 * b[7];
        t[i + 8] = a0 * b[8] + a1 * b[9] + a2 * b[10] + a3 * b[11];
        t[i + 12] = a0 * b[12] + a1 * b[13] + a2 * b[14] + a3 * b[15];
      }
      o.set(t); return o;
    },
    translate: function (m, x, y, z) { for (var i = 0; i < 4; i++) { m[12 + i] += m[i] * x + m[4 + i] * y + m[8 + i] * z; } return m; },
    rotY: function (m, a) { var c = Math.cos(a), s = Math.sin(a); for (var i = 0; i < 4; i++) { var a0 = m[i], a2 = m[8 + i]; m[i] = a0 * c - a2 * s; m[8 + i] = a0 * s + a2 * c; } return m; },
    rotX: function (m, a) { var c = Math.cos(a), s = Math.sin(a); for (var i = 0; i < 4; i++) { var a1 = m[4 + i], a2 = m[8 + i]; m[4 + i] = a1 * c + a2 * s; m[8 + i] = a2 * c - a1 * s; } return m; },
    rotZ: function (m, a) { var c = Math.cos(a), s = Math.sin(a); for (var i = 0; i < 4; i++) { var a0 = m[i], a1 = m[4 + i]; m[i] = a0 * c + a1 * s; m[4 + i] = a1 * c - a0 * s; } return m; },
    scale: function (m, x, y, z) { for (var i = 0; i < 4; i++) { m[i] *= x; m[4 + i] *= y; m[8 + i] *= z; } return m; },
    invert: function (o, a) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      var b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
      var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) { return null; }
      det = 1 / det;
      o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det; o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det; o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det; o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det; o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      return o;
    }
  };
  M4._t = new Float32Array(16);

  var VS_MAIN = "#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPos;\nlayout(location=1) in vec3 aNor;\nlayout(location=2) in vec3 aCol;\nlayout(location=3) in vec3 aExt;\nuniform mat4 uVP;\nuniform mat4 uModel;\nuniform mat4 uLightVP;\nuniform float uTime;\nuniform float uWind;\nout vec3 vPos;\nout vec3 vNor;\nout vec3 vCol;\nout vec3 vExt;\nout vec4 vLight;\nvoid main() {\n  vec4 wp = uModel * vec4(aPos, 1.0);\n  float s = aExt.z * uWind;\n  if (s > 0.0) {\n    float ph = uTime * 1.7 + wp.x * 0.37 + wp.z * 0.23;\n    wp.x += sin(ph) * 0.11 * s;\n    wp.z += cos(ph * 0.83 + 1.3) * 0.09 * s;\n    wp.y += sin(ph * 1.3) * 0.025 * s;\n  }\n  vPos = wp.xyz;\n  vNor = mat3(uModel) * aNor;\n  vCol = aCol;\n  vExt = aExt;\n  vLight = uLightVP * wp;\n  gl_Position = uVP * wp;\n}";
  var FS_MAIN = "#version 300 es\nprecision highp float;\nprecision highp sampler2DArray;\nprecision highp sampler2DShadow;\nin vec3 vPos;\nin vec3 vNor;\nin vec3 vCol;\nin vec3 vExt;\nin vec4 vLight;\nuniform vec3 uSunDir;\nuniform vec3 uSunCol;\nuniform vec3 uSkyAmb;\nuniform vec3 uGndAmb;\nuniform vec3 uFogCol;\nuniform float uFogDen;\nuniform vec3 uCamPos;\nuniform float uNight;\nuniform vec3 uTint;\nuniform vec4 uFlat;\nuniform sampler2DArray uTex;\nuniform float uTexOn;\nuniform sampler2DShadow uShadow;\nuniform float uShadowOn;\nuniform float uShadowTexel;\nuniform vec4 uTexScaleA;\nuniform vec4 uTexScaleB;\nuniform vec4 uTexAmtA;\nuniform vec4 uTexAmtB;\nout vec4 outCol;\nvoid main() {\n  if (uFlat.a > 0.0) { outCol = uFlat; return; }\n  vec3 n = normalize(vNor);\n  if (!gl_FrontFacing) { n = -n; }\n  vec3 base = vCol * uTint;\n  float mat = vExt.x;\n  if (mat > -0.5 && uTexOn > 0.5) {\n" +
      "    float layer = floor(mat + 0.01);\n    int li = int(layer);\n    vec3 an = abs(n);\n    vec2 uv = an.y > max(an.x, an.z) ? vPos.xz : (an.x > an.z ? vPos.zy : vPos.xy);\n    if (fract(mat) > 0.25) { uv = uv.yx; }\n    float sc = li < 4 ? uTexScaleA[li] : uTexScaleB[li - 4];\n    float am = li < 4 ? uTexAmtA[li] : uTexAmtB[li - 4];\n    float d = texture(uTex, vec3(uv * sc, layer)).r;\n    base *= mix(1.0, 0.42 + 1.16 * d, am);\n  }\n  float sh = 1.0;\n  if (uShadowOn > 0.5) {\n    vec3 lc = vLight.xyz / vLight.w * 0.5 + 0.5;\n    if (lc.x > 0.002 && lc.x < 0.998 && lc.y > 0.002 && lc.y < 0.998 && lc.z < 0.999) {\n      lc.z -= 0.0012 + 0.0026 * (1.0 - clamp(dot(n, uSunDir), 0.0, 1.0));\n      float o = uShadowTexel;\n" +
      "      sh = texture(uShadow, vec3(lc.xy + vec2(-o, -o), lc.z)) + texture(uShadow, vec3(lc.xy + vec2(o, -o), lc.z)) + texture(uShadow, vec3(lc.xy + vec2(-o, o), lc.z)) + texture(uShadow, vec3(lc.xy + vec2(o, o), lc.z));\n      sh *= 0.25;\n    }\n  }\n  float ndl = max(dot(n, uSunDir), 0.0);\n  vec3 amb = mix(uGndAmb, uSkyAmb, n.y * 0.5 + 0.5);\n  vec3 col = base * (amb + uSunCol * ndl * sh);\n  vec3 v = normalize(uCamPos - vPos);\n  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);\n  col += rim * uSkyAmb * 0.1;\n  float em = vExt.y;\n  if (em > 0.01) {\n    float glow = em > 1.5 ? 1.0 : uNight;\n    float k = min(em, 1.0);\n    col = mix(col * mix(1.0, 0.55, k), base * 1.3 + vec3(0.14, 0.07, 0.0), clamp(glow * k, 0.0, 1.0));\n  }\n  float dist = length(uCamPos - vPos);\n  float f = 1.0 - exp(-pow(dist * uFogDen, 2.0));\n  col = mix(col, uFogCol, clamp(f, 0.0, 1.0));\n" +
      "  outCol = vec4(col, 1.0);\n}";
  var VS_DEPTH = "#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPos;\nlayout(location=3) in vec3 aExt;\nuniform mat4 uLightVP;\nuniform mat4 uModel;\nuniform float uTime;\nuniform float uWind;\nvoid main() {\n  vec4 wp = uModel * vec4(aPos, 1.0);\n  float s = aExt.z * uWind;\n  if (s > 0.0) {\n    float ph = uTime * 1.7 + wp.x * 0.37 + wp.z * 0.23;\n    wp.x += sin(ph) * 0.11 * s;\n    wp.z += cos(ph * 0.83 + 1.3) * 0.09 * s;\n  }\n  gl_Position = uLightVP * wp;\n}";
  var FS_DEPTH = "#version 300 es\nprecision mediump float;\nvoid main() {}";
  var VS_WATER = "#version 300 es\nprecision highp float;\nlayout(location=0) in vec2 aXZ;\nuniform mat4 uVP;\nuniform float uTime;\nout vec3 vPos;\nout vec3 vN;\nvoid main() {\n  vec2 p = aXZ;\n  float t = uTime;\n  vec2 k1 = vec2(0.21, 0.13); vec2 k2 = vec2(-0.12, 0.27); vec2 k3 = vec2(0.47, -0.36);\n  float s1 = dot(k1, p) + 0.9 * t; float s2 = dot(k2, p) + 1.2 * t; float s3 = dot(k3, p) + 2.1 * t;\n  float h = 0.10 * sin(s1) + 0.08 * sin(s2) + 0.035 * sin(s3);\n  vec2 d = 0.10 * cos(s1) * k1 + 0.08 * cos(s2) * k2 + 0.035 * cos(s3) * k3;\n  vPos = vec3(p.x, h, p.y);\n  vN = normalize(vec3(-d.x, 1.0, -d.y));\n  gl_Position = uVP * vec4(vPos, 1.0);\n}";
  var FS_WATER = "#version 300 es\nprecision highp float;\nin vec3 vPos;\nin vec3 vN;\nuniform sampler2D uHeight;\nuniform vec3 uHRect;\nuniform vec3 uCamPos;\nuniform vec3 uSunDir;\nuniform vec3 uSunCol;\nuniform vec3 uFogCol;\nuniform float uFogDen;\nuniform float uTime;\nuniform float uNight;\nuniform vec3 uSkyHor;\nuniform vec3 uSkyTop;\nuniform vec3 uShallow;\nuniform vec3 uDeep;\nout vec4 outCol;\nfloat hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\nfloat vnoise(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f); float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0)); return mix(mix(a, b, u.x), mix(c, d, u.x), u.y); }\nvoid main() {\n  vec2 uv = (vPos.xz - uHRect.xy) / uHRect.z;\n  float th = texture(uHeight, uv).r * 8.0 - 6.0;\n  float depth = max(vPos.y - th, 0.0);\n" +
      "  vec3 v = normalize(uCamPos - vPos);\n  float t = uTime;\n  vec2 q = vPos.xz * 1.3;\n  float r1 = vnoise(q + vec2(t * 0.35, t * 0.2));\n  float r2 = vnoise(q * 1.9 - vec2(t * 0.25, -t * 0.3));\n  vec3 n = normalize(vN + vec3(r1 - 0.5, 0.0, r2 - 0.5) * 0.35);\n  vec3 col = mix(uShallow, uDeep, smoothstep(0.15, 4.5, depth));\n  float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);\n  col = mix(col, mix(uSkyHor, uSkyTop, 0.35), clamp(fres * 0.7, 0.0, 0.7));\n  vec3 hlf = normalize(uSunDir + v);\n  float spec = pow(max(dot(n, hlf), 0.0), 140.0);\n  col += uSunCol * spec * (1.6 - uNight * 0.9) * step(0.0, uSunDir.y + 0.05);\n  float fz = 1.0 - smoothstep(0.0, 0.85, depth);\n  float band = sin(depth * 16.0 - t * 2.6 + vnoise(vPos.xz * 0.8) * 4.0) * 0.5 + 0.5;\n  float foam = fz * (0.35 + 0.65 * band) * smoothstep(0.35, 0.65, vnoise(vPos.xz * 2.5 + t * 0.4) + fz * 0.5);\n" +
      "  foam += (1.0 - smoothstep(0.0, 0.12, depth)) * 0.8;\n  foam = clamp(foam, 0.0, 1.0);\n  col = mix(col, vec3(1.0, 0.99, 0.95), foam * 0.85);\n  float sp = step(0.985, vnoise(vPos.xz * 6.0 + t * 1.5)) * (1.0 - uNight * 0.5) * smoothstep(0.3, 0.8, max(dot(n, hlf), 0.0));\n  col += sp * 0.6;\n  float alpha = mix(0.42, 0.95, smoothstep(0.05, 2.4, depth));\n  alpha = max(alpha, foam);\n  float dist = length(uCamPos - vPos);\n  float f = clamp(1.0 - exp(-pow(dist * uFogDen, 2.0)), 0.0, 1.0);\n  col = mix(col, uFogCol, f);\n  alpha = mix(alpha, 1.0, f);\n  outCol = vec4(col, alpha);\n}";
  var VS_SKY = "#version 300 es\nout vec2 vNdc;\nvoid main() {\n  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);\n  vNdc = p;\n  gl_Position = vec4(p, 0.999, 1.0);\n}";
  var FS_SKY = "#version 300 es\nprecision highp float;\nin vec2 vNdc;\nuniform mat4 uInvVP;\nuniform vec3 uCamPos;\nuniform vec3 uSkyTop;\nuniform vec3 uSkyHor;\nuniform vec3 uFogCol;\nuniform vec3 uSunDir;\nuniform vec3 uSunCol;\nuniform vec3 uMoonDir;\nuniform float uNight;\nuniform float uTime;\nout vec4 outCol;\nfloat hash3(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }\nvoid main() {\n  vec4 w = uInvVP * vec4(vNdc, 1.0, 1.0);\n  vec3 dir = normalize(w.xyz / w.w - uCamPos);\n  float y = dir.y;\n  vec3 col = mix(uSkyHor, uSkyTop, pow(clamp(y, 0.0, 1.0), 0.6));\n  col = mix(uFogCol, col, smoothstep(-0.02, 0.06, y));\n  float sd = max(dot(dir, uSunDir), 0.0);\n  col += uSunCol * (smoothstep(0.9990, 0.9996, sd) * 2.2 + pow(sd, 18.0) * 0.28) * (1.0 - uNight) * step(0.0, uSunDir.y + 0.08);\n  float md = max(dot(dir, uMoonDir), 0.0);\n  col += vec3(0.95, 0.96, 1.0) * (smoothstep(0.9992, 0.9995, md) * 1.3 + pow(md, 50.0) * 0.14) * uNight;\n  if (uNight > 0.02 && y > 0.0) {\n    vec3 q = dir * 170.0;\n    vec3 id = floor(q);\n    float h = hash3(id);\n    if (h > 0.9965) {\n      vec3 f = fract(q) - 0.5;\n      float s = smoothstep(0.26, 0.0, length(f)) * (0.55 + 0.45 * sin(uTime * 2.3 + h * 91.0));\n      col += vec3(s) * uNight * smoothstep(0.02, 0.3, y);\n    }\n  }\n  outCol = vec4(col, 1.0);\n}";
  var VS_PART = "#version 300 es\nprecision highp float;\nlayout(location=0) in vec4 aP;\nlayout(location=1) in vec4 aC;\nlayout(location=2) in float aK;\nuniform mat4 uVP;\nuniform float uScale;\nout vec4 vC;\nout float vK;\nvoid main() {\n  vec4 c = uVP * vec4(aP.xyz, 1.0);\n  gl_Position = c;\n  gl_PointSize = clamp(aP.w * uScale / max(c.w, 0.1), 1.0, 72.0);\n  vC = aC;\n  vK = aK;\n}";
  var FS_PART = "#version 300 es\nprecision mediump float;\nin vec4 vC;\nin float vK;\nout vec4 outCol;\nvoid main() {\n  vec2 p = gl_PointCoord * 2.0 - 1.0;\n  float a;\n  if (vK < 0.5) { a = smoothstep(1.0, 0.0, length(p)); a *= a; }\n  else if (vK < 1.5) { vec2 q = vec2(p.x, -p.y) * 1.3 + vec2(0.0, 0.28); float h = pow(q.x * q.x + q.y * q.y - 0.5, 3.0) - q.x * q.x * q.y * q.y * q.y; a = smoothstep(0.03, -0.03, h); }\n  else if (vK < 2.5) { a = smoothstep(1.0, 0.72, length(p * vec2(1.0, 1.9))); }\n  else { a = smoothstep(1.0, 0.0, length(p)); a = a * a * a; }\n  if (a < 0.01) { discard; }\n  outCol = vec4(vC.rgb, vC.a * a);\n}";
  var VS_BLOB = "#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPos;\nuniform mat4 uVP;\nuniform vec4 uBlob;\nout float vA;\nvoid main() {\n  vA = aPos.y;\n  gl_Position = uVP * vec4(uBlob.x + aPos.x * uBlob.w, uBlob.y, uBlob.z + aPos.z * uBlob.w, 1.0);\n}";
  var FS_BLOB = "#version 300 es\nprecision mediump float;\nin float vA;\nuniform float uAlpha;\nout vec4 outCol;\nvoid main() { outCol = vec4(0.08, 0.05, 0.16, vA * vA * uAlpha); }";
  var VS_GLOW = "#version 300 es\nprecision highp float;\nlayout(location=0) in vec2 aQ;\nuniform mat4 uVP;\nuniform vec3 uBase;\nuniform vec2 uSize;\nuniform vec3 uRight;\nuniform vec3 uUp;\nout vec2 vQ;\nvoid main() {\n  vQ = aQ;\n  vec3 p = uBase + uRight * (aQ.x * uSize.x) + uUp * (aQ.y * uSize.y);\n  gl_Position = uVP * vec4(p, 1.0);\n}";
  var FS_GLOW = "#version 300 es\nprecision mediump float;\nin vec2 vQ;\nuniform vec4 uColor;\nuniform float uMode;\nout vec4 outCol;\nvoid main() {\n  float a;\n  if (uMode < 0.5) { a = pow(1.0 - vQ.y, 1.6) * smoothstep(0.5, 0.0, abs(vQ.x)); }\n  else { vec2 c = vec2(vQ.x, vQ.y - 0.5) * 2.0; a = smoothstep(1.0, 0.0, length(c)); a *= a; }\n  outCol = vec4(uColor.rgb, uColor.a * a);\n}";

  var R = null;

  function glCompile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { var log = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error("shader: " + log); }
    return s;
  }
  function glProgram(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, glCompile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, glCompile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { throw new Error("link: " + gl.getProgramInfoLog(p)); }
    var u = {}; var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i); u[info.name.replace(/\[0\]$/, "")] = gl.getUniformLocation(p, info.name); }
    return { p: p, u: u };
  }
  function glMesh(gl, data) {
    var vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var st = 48;
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, st, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, st, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 3, gl.FLOAT, false, st, 24);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 3, gl.FLOAT, false, st, 36);
    gl.bindVertexArray(null);
    return { vao: vao, vb: vb, n: data.length / 12 };
  }
  function glSimpleMesh(gl, data, comps) {
    var vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, comps, gl.FLOAT, false, comps * 4, 0);
    gl.bindVertexArray(null);
    return { vao: vao, vb: vb, n: data.length / comps };
  }

  function initRenderer(canvas) {
    var gl = null;
    try { gl = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "low-power", premultipliedAlpha: false, preserveDrawingBuffer: false }); } catch (e) { gl = null; }
    if (!gl) { return null; }
    var r = { gl: gl, canvas: canvas, ok: true };
    try {
      r.main = glProgram(gl, VS_MAIN, FS_MAIN);
      r.depth = glProgram(gl, VS_DEPTH, FS_DEPTH);
      r.water = glProgram(gl, VS_WATER, FS_WATER);
      r.sky = glProgram(gl, VS_SKY, FS_SKY);
      r.part = glProgram(gl, VS_PART, FS_PART);
      r.blob = glProgram(gl, VS_BLOB, FS_BLOB);
      r.glow = glProgram(gl, VS_GLOW, FS_GLOW);
    } catch (e) { return null; }
    r.emptyVao = gl.createVertexArray();
    r.view = M4.create(); r.proj = M4.create(); r.vp = M4.create(); r.inv = M4.create(); r.lightVP = M4.create(); r.model = M4.create(); r.tmp = M4.create();
    r.camPos = [0, 10, 20]; r.right = [1, 0, 0];
    /* shadow map */
    var small = Math.min(window.innerWidth, window.innerHeight) < 700;
    r.shSize = small ? 1024 : 2048;
    try {
      r.shTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, r.shTex);
      gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, r.shSize, r.shSize);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
      r.shFB = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, r.shFB);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, r.shTex, 0);
      gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE);
      r.shadowOK = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } catch (e) { r.shadowOK = false; }
    r.shadowDirty = true;
    r.ident = M4.create(); r.up = [0, 1, 0];
    r.dummyShadow = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, r.dummyShadow);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, 1, 1, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, new Uint32Array([4294967295]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    /* placeholder 1-layer texture array until the detail strip loads */
    r.detail = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D_ARRAY, r.detail);
    gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.R8, 1, 1, 1, 0, gl.RED, gl.UNSIGNED_BYTE, new Uint8Array([128]));
    r.texOn = 0;
    /* unit primitives for characters & props */
    r.quad = glSimpleMesh(gl, new Float32Array([-0.5, 0, 0.5, 0, 0.5, 1, -0.5, 0, 0.5, 1, -0.5, 1]), 2);
    var disc = []; var seg = 18;
    for (var i = 0; i < seg; i++) { var a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU; disc.push(0, 1, 0, Math.cos(a0), 0, Math.sin(a0), Math.cos(a1), 0, Math.sin(a1)); }
    r.disc = glSimpleMesh(gl, new Float32Array(disc), 3);
    /* particles */
    r.pMax = 700; r.pData = new Float32Array(r.pMax * 9);
    r.pVao = gl.createVertexArray(); gl.bindVertexArray(r.pVao);
    r.pBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, r.pBuf); gl.bufferData(gl.ARRAY_BUFFER, r.pData.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 36, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 36, 16);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 36, 32);
    gl.bindVertexArray(null);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    return r;
  }

  function loadDetailTexture(r, src) {
    var img = new Image();
    img.onload = function () {
      try {
        var w = img.naturalWidth, h = img.naturalHeight, layers = Math.round(h / w);
        if (!w || layers < 1) { return; }
        var cv = doc.createElement("canvas"); cv.width = w; cv.height = h;
        var cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
        var px = cx.getImageData(0, 0, w, h).data; var d = new Uint8Array(w * h);
        for (var i = 0; i < d.length; i++) { d[i] = px[i * 4]; }
        var gl = r.gl; gl.bindTexture(gl.TEXTURE_2D_ARRAY, r.detail);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.R8, w, w, layers, 0, gl.RED, gl.UNSIGNED_BYTE, d);
        gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT);
        var an = gl.getExtension("EXT_texture_filter_anisotropic");
        if (an) { gl.texParameterf(gl.TEXTURE_2D_ARRAY, an.TEXTURE_MAX_ANISOTROPY_EXT, 4); }
        r.texOn = 1;
      } catch (e) { r.texOn = 0; }
    };
    img.src = src;
  }

  function makeHeightTexture(r, fn, minX, size, n) {
    var gl = r.gl; var d = new Uint8Array(n * n);
    for (var j = 0; j < n; j++) {
      for (var i = 0; i < n; i++) {
        var x = minX + (i + 0.5) / n * size, z = minX + (j + 0.5) / n * size;
        d[j * n + i] = clamp(Math.round((fn(x, z) + 6) / 8 * 255), 0, 255);
      }
    }
    r.hTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, r.hTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, n, n, 0, gl.RED, gl.UNSIGNED_BYTE, d);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    r.hRect = [minX, minX, size];
  }

  function makeWaterMesh(r, half, cells) {
    var gl = r.gl; var d = []; var s = half * 2 / cells;
    for (var j = 0; j < cells; j++) {
      for (var i = 0; i < cells; i++) {
        var x0 = -half + i * s, z0 = -half + j * s, x1 = x0 + s, z1 = z0 + s;
        d.push(x0, z0, x1, z0, x1, z1, x0, z0, x1, z1, x0, z1);
      }
    }
    var far = 600;
    [[-far, -far, far, -half], [-far, half, far, far], [-far, -half, -half, half], [half, -half, far, half]].forEach(function (q) {
      d.push(q[0], q[1], q[2], q[1], q[2], q[3], q[0], q[1], q[2], q[3], q[0], q[3]);
    });
    r.waterMesh = glSimpleMesh(gl, new Float32Array(d), 2);
  }

  function setMainUniforms(r, env, t) {
    var gl = r.gl, u = r.main.u;
    gl.useProgram(r.main.p);
    gl.uniformMatrix4fv(u.uVP, false, r.vp);
    gl.uniformMatrix4fv(u.uLightVP, false, r.lightVP);
    gl.uniform1f(u.uTime, t); gl.uniform1f(u.uWind, env.wind);
    gl.uniform3fv(u.uSunDir, env.sunDir); gl.uniform3fv(u.uSunCol, env.sunCol);
    gl.uniform3fv(u.uSkyAmb, env.ambSky); gl.uniform3fv(u.uGndAmb, env.ambGnd);
    gl.uniform3fv(u.uFogCol, env.fog); gl.uniform1f(u.uFogDen, env.fogDen);
    gl.uniform3fv(u.uCamPos, r.camPos); gl.uniform1f(u.uNight, env.night);
    gl.uniform3f(u.uTint, 1, 1, 1); gl.uniform4f(u.uFlat, 0, 0, 0, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D_ARRAY, r.detail); gl.uniform1i(u.uTex, 0); gl.uniform1f(u.uTexOn, r.texOn);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, r.shadowOK && !r.inShadowPass ? r.shTex : r.dummyShadow); gl.uniform1i(u.uShadow, 1);
    gl.uniform1f(u.uShadowOn, r.shadowOK && env.sunDir[1] > -0.05 ? 1 : 0); gl.uniform1f(u.uShadowTexel, 1.2 / r.shSize);
    gl.uniform4f(u.uTexScaleA, 0.34, 0.42, 0.55, 0.62); gl.uniform4f(u.uTexScaleB, 0.5, 0.4, 0.3, 0.27);
    gl.uniform4f(u.uTexAmtA, 0.62, 0.55, 0.78, 0.9); gl.uniform4f(u.uTexAmtB, 0.85, 0.4, 0.65, 0.62);
  }
  function drawMesh(r, mesh, model, tint) {
    var gl = r.gl, u = r.main.u;
    gl.uniformMatrix4fv(u.uModel, false, model || r.ident);
    if (tint) { gl.uniform3fv(u.uTint, tint); } else { gl.uniform3f(u.uTint, 1, 1, 1); }
    gl.bindVertexArray(mesh.vao); gl.drawArrays(gl.TRIANGLES, 0, mesh.n);
  }
  function drawDepth(r, mesh, model) {
    var gl = r.gl; gl.uniformMatrix4fv(r.depth.u.uModel, false, model || r.ident);
    gl.bindVertexArray(mesh.vao); gl.drawArrays(gl.TRIANGLES, 0, mesh.n);
  }
  function drawGlow(r, base, w, h, color, alpha, mode, upright) {
    var gl = r.gl, u = r.glow.u, up = upright ? [0, 1, 0] : r.up;
    if (mode > 0.5) { base = [base[0] - up[0] * h / 2, base[1] - up[1] * h / 2, base[2] - up[2] * h / 2]; }
    gl.uniform3fv(u.uBase, base); gl.uniform2f(u.uSize, w, h);
    gl.uniform3fv(u.uRight, r.right);
    gl.uniform3fv(u.uUp, up);
    gl.uniform4f(u.uColor, color[0], color[1], color[2], alpha); gl.uniform1f(u.uMode, mode);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /* ================= THE ISLAND (procedural, deterministic) ================= */
  function hash2(x, z) { var s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
  function vnoise(x, z) {
    var xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
    var u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
    var a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function coastR(a) { return 31 + 2.4 * Math.sin(2 * a + 0.9) + 1.7 * Math.sin(3 * a + 2.4) + 1.0 * Math.sin(5 * a + 0.3) + 0.55 * Math.sin(9 * a + 1.7); }
  function coastD(x, z) { return coastR(Math.atan2(z, x)) - Math.hypot(x, z); }
  function baseHeight(x, z) {
    var d = coastD(x, z);
    var h = -0.3 + 0.5 * Math.min(d, 0) + 0.9 * smooth(0, 5, d) + 0.55 * smooth(5, 12, d);
    h += (vnoise(x * 0.11, z * 0.11) - 0.5) * 1.2 * smooth(4, 10, d);
    h += 5.2 * Math.exp(-(x * x + (z + 21) * (z + 21)) / 84.5) * smooth(2, 8, d);
    h += 3.0 * Math.exp(-((x + 27) * (x + 27) + (z + 3) * (z + 3)) / 35.3) * smooth(0.3, 3.2, d);
    h += 1.7 * Math.exp(-((x - 19) * (x - 19) + (z + 16) * (z + 16)) / 30) * smooth(2, 6, d);
    return Math.max(h, -4);
  }
  var PADS = [];
  function addPad(x, z, r, minH) { PADS.push({ x: x, z: z, r: r, h: Math.max(baseHeight(x, z), minH == null ? 0.5 : minH) }); }
  function height(x, z) {
    var h = baseHeight(x, z);
    for (var i = 0; i < PADS.length; i++) {
      var p = PADS[i], dx = x - p.x, dz = z - p.z, lim = p.r + 2.8;
      if (dx > lim || dx < -lim || dz > lim || dz < -lim) { continue; }
      var dd = Math.sqrt(dx * dx + dz * dz);
      if (dd < lim) { var w = 1 - smooth(p.r, lim, dd); h = h * (1 - w) + p.h * w; }
    }
    return h;
  }

  /* ---------- location table (door = trigger point in front of each entrance) ---------- */
  var WL = {
    hero: { name: window.PULAU.translate("Dermaga Kedatangan"), ico: "i-anchor", c: "#2bb3c0", x: 0, z: 27.4, door: [0, 27.6], r: 2.3, top: 4.6 },
    prasasti: { name: window.PULAU.translate("Batu Prasasti"), ico: "i-stone", c: "#35b7d6", x: -8, z: 21.5, door: [-8, 23.3], r: 1.9, top: 4.2 },
    couple: { name: window.PULAU.translate("Rumah Keluarga"), ico: "i-house", c: "#ff6f9a", x: -17, z: 2.5, door: [-17, 6.1], r: 1.9, top: 7.4, doors: [{ x: -17, z: 6.1, who: "groom", lx: -17, lz: 2.5 }, { x: 17, z: 6.1, who: "bride", lx: 17, lz: 2.5 }] },
    kisah: { name: window.PULAU.translate("Ruang Trofi"), ico: "i-trophy", c: "#e5a312", x: -12, z: -11, door: [-12, -7.8], r: 1.9, top: 8 },
    countdown: { name: window.PULAU.translate("Api Unggun"), ico: "i-fire", c: "#ff7b3d", x: 10, z: 19, door: [10, 20.7], r: 2.1, top: 4 },
    events: { name: window.PULAU.translate("Pendopo Agung"), ico: "i-pendopo", c: "#e0374d", x: 0, z: 0, door: [0, 7.2], r: 2.2, top: 10.2 },
    rundown: { name: window.PULAU.translate("Gapura Janur"), ico: "i-gapura", c: "#c9a227", x: 0, z: 14.5, door: [0, 15.6], r: 2, top: 6.6 },
    venue: { name: window.PULAU.translate("Menara Sinkronisasi"), ico: "i-tower", c: "#17a2b8", x: 0, z: -21, door: [0, -18.7], r: 2, top: 17 },
    hotel: { name: window.PULAU.translate("Penginapan"), ico: "i-bed", c: "#6d7bff", x: 21, z: -7, door: [21, -3.7], r: 2, top: 9.4 },
    dresscode: { name: window.PULAU.translate("Ruang Ganti"), ico: "i-hanger", c: "#9b6bff", x: -11, z: 11.5, door: [-11, 14], r: 1.8, top: 5.6 },
    gallery: { name: window.PULAU.translate("Studio Foto"), ico: "i-camera", c: "#ff5f86", x: 12, z: -11, door: [12, -8], r: 1.9, top: 6.4 },
    video: { name: window.PULAU.translate("Bioskop Pulau"), ico: "i-film", c: "#d23a4f", x: -21.5, z: -7.5, door: [-21.5, -4.2], r: 1.9, top: 7.2 },
    misi: { name: window.PULAU.translate("Papan Misi"), ico: "i-scroll", c: "#b07410", x: -7.5, z: 7.5, door: [-7.5, 8.9], r: 1.7, top: 4.4 },
    harta: { name: window.PULAU.translate("Kapal Karam"), ico: "i-chest", c: "#8b5a33", x: -20, z: 19.5, door: [-17.8, 19.2], r: 1.9, top: 4.8 },
    rsvp: { name: window.PULAU.translate("Balai Petualang"), ico: "i-flag", c: "#3fa9f5", x: 8.5, z: 8, door: [8.5, 10.7], r: 1.9, top: 7.6 },
    gifts: { name: window.PULAU.translate("Sumur Harapan"), ico: "i-well", c: "#2bb3c0", x: -15, z: 16, door: [-15, 17.7], r: 1.8, top: 4.4 },
    wishes: { name: window.PULAU.translate("Taman Pesan"), ico: "i-lantern", c: "#ff9a3c", x: 20.5, z: 12.5, door: [20.5, 14.9], r: 2.1, top: 5.4 },
    closing: { name: window.PULAU.translate("Bukit Senja"), ico: "i-sunset", c: "#ff7b6b", x: -27, z: -3, door: [-25.3, -3], r: 1.9, top: 7.6 }
  };
  WL.couple.name = window.PULAU.translate("Rumah Keluarga") + " · " + GROOM + " & " + BRIDE;
  var ROADS = [
    [[0, 28.6], [0, 22], [0, 14.5], [0, 7.6]],
    [[-0.6, 22.6], [-4.5, 23.4], [-8, 23.4]],
    [[-6.5, 3.2], [-11.5, 5.2], [-17, 6.2]],
    [[6.5, 3.2], [11.5, 5.2], [17, 6.2]],
    [[0, -7.4], [0.8, -12], [-0.6, -16], [0, -18.8]],
    [[-5, -5.8], [-9, -7.6], [-12, -8]],
    [[-12, -8], [-17, -6.4], [-21.5, -4.4]],
    [[5, -5.8], [9, -7.6], [12, -8.1]],
    [[12, -8.1], [17, -5.2], [21, -3.8]],
    [[0, 19.6], [-5, 16.8], [-11, 14.3], [-15, 17.9], [-17.8, 19.3]],
    [[0, 21.2], [5, 21.5], [10, 21], [15.5, 17.4], [20.5, 15]],
    [[-17, 6.2], [-21.5, 2.4], [-25.3, -2.6]],
    [[8.5, 10.7], [5.2, 7.6]],
    [[-7.5, 9], [-5.2, 7.4]]
  ];
  function segDist(px, pz, a, b) {
    var vx = b[0] - a[0], vz = b[1] - a[1], wx = px - a[0], wz = pz - a[1];
    var t = clamp((wx * vx + wz * vz) / (vx * vx + vz * vz || 1), 0, 1);
    var dx = wx - vx * t, dz = wz - vz * t; return Math.sqrt(dx * dx + dz * dz);
  }
  function roadDist(x, z) {
    var best = 99;
    for (var i = 0; i < ROADS.length; i++) { var r = ROADS[i]; for (var j = 0; j < r.length - 1; j++) { var d = segDist(x, z, r[j], r[j + 1]); if (d < best) { best = d; } } }
    return best;
  }

  /* ---------- palette & materials ---------- */
  function hex(h) { var n = parseInt(h.replace("#", ""), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  function mixC(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  var C = {
    wall: hex("#f7ecd6"), wallP: hex("#fde3e3"), wallB: hex("#e3eefc"), roof: hex("#dd6440"), roof2: hex("#a9483a"), roofB: hex("#4f6fb8"), roofG: hex("#3f8a57"),
    wood: hex("#a8703f"), woodDk: hex("#6b4526"), woodLt: hex("#c99561"), stone: hex("#d6cdbd"), stoneDk: hex("#a39a8b"), brick: hex("#bf5c3d"),
    gold: hex("#ffc93d"), glass: hex("#ffd27a"), door: hex("#7a4a2a"), leafA: hex("#5cb85c"), leafB: hex("#44a052"), leafC: hex("#8fd16a"), leafD: hex("#2f8a4a"),
    trunk: hex("#8a5a33"), palm: hex("#5fb04a"), white: hex("#ffffff"), cream: hex("#fff3d6"), pink: hex("#ff6f9a"), blue: hex("#3fa9f5"), teal: hex("#2bb3c0"),
    red: hex("#d8374d"), purple: hex("#9b6bff"), dark: hex("#2a2140"), cyan: hex("#7fe8ff"), janur: hex("#e8c547"), sail: hex("#fff6e6"), orange: hex("#ff8a3d"),
    grassA: hex("#8ed36a"), grassB: hex("#62b158"), grassF: hex("#4b9a4f"), sand: hex("#f0dca6"), sandWet: hex("#d7c08b"), path: hex("#dcc293"), plaza: hex("#dbd1bf"), rock: hex("#9c948a")
  };
  var M_GRASS = 0, M_SAND = 1, M_STONE = 2, M_ROOF = 3, M_WOOD = 4, M_PLASTER = 5, M_DIRT = 6, M_ROCK = 7, M_NONE = -1;

  /* ---------- geometry builder ---------- */
  function Builder(seed) { this.a = []; this.swK = 0; this.swB = 0; this.rng = seed || 7; }
  Builder.prototype.rand = function () { this.rng = this.rng * 16807 % 2147483647; return (this.rng - 1) / 2147483646; };
  Builder.prototype.tri = function (a, b, c, col, mat, em) {
    var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= l; ny /= l; nz /= l;
    var j = 0.95 + this.rand() * 0.1, m = mat == null ? -1 : mat, e = em || 0, k = this.swK, sb = this.swB, A = this.a;
    var r = col[0] * j, g = col[1] * j, bl = col[2] * j;
    A.push(a[0], a[1], a[2], nx, ny, nz, r, g, bl, m, e, k > 0 ? Math.max(0, a[1] - sb) * k : 0);
    A.push(b[0], b[1], b[2], nx, ny, nz, r, g, bl, m, e, k > 0 ? Math.max(0, b[1] - sb) * k : 0);
    A.push(c[0], c[1], c[2], nx, ny, nz, r, g, bl, m, e, k > 0 ? Math.max(0, c[1] - sb) * k : 0);
  };
  Builder.prototype.quad = function (a, b, c, d, col, mat, em) { this.tri(a, b, c, col, mat, em); this.tri(a, c, d, col, mat, em); };
  Builder.prototype.data = function () { return new Float32Array(this.a); };
  function frame(x, y, z, ry, rx, rz) {
    var cy = Math.cos(ry || 0), sy = Math.sin(ry || 0), cx = Math.cos(rx || 0), sx = Math.sin(rx || 0), cz = Math.cos(rz || 0), sz = Math.sin(rz || 0);
    return function (lx, ly, lz) {
      var x1 = lx * cz - ly * sz, y1 = lx * sz + ly * cz;
      var y2 = y1 * cx - lz * sx, z2 = y1 * sx + lz * cx;
      return [x + x1 * cy + z2 * sy, y + y2, z - x1 * sy + z2 * cy];
    };
  }
  function box(B, f, x0, y0, z0, x1, y1, z1, col, mat, em, bottom) {
    var a = f(x0, y0, z0), b = f(x1, y0, z0), c = f(x0, y1, z0), d = f(x1, y1, z0), e = f(x0, y0, z1), g = f(x1, y0, z1), h = f(x0, y1, z1), k = f(x1, y1, z1);
    B.quad(e, g, k, h, col, mat, em); B.quad(b, a, c, d, col, mat, em); B.quad(a, e, h, c, col, mat, em); B.quad(g, b, d, k, col, mat, em); B.quad(h, k, d, c, col, mat, em);
    if (bottom) { B.quad(a, b, g, e, col, mat, em); }
  }
  function gable(B, f, x0, x1, z0, z1, yb, yt, ov, col, mat, wcol, wmat) {
    var zc = (z0 + z1) / 2;
    var a = f(x0 - ov, yb - 0.18, z0 - ov), b = f(x1 + ov, yb - 0.18, z0 - ov), c = f(x1 + ov, yt, zc), d = f(x0 - ov, yt, zc);
    var e = f(x0 - ov, yb - 0.18, z1 + ov), g = f(x1 + ov, yb - 0.18, z1 + ov);
    B.quad(a, b, c, d, col, mat); B.quad(e, g, c, d, col, mat);
    var t = 0.14, a2 = f(x0 - ov, yb - 0.18 - t, z0 - ov), b2 = f(x1 + ov, yb - 0.18 - t, z0 - ov), e2 = f(x0 - ov, yb - 0.18 - t, z1 + ov), g2 = f(x1 + ov, yb - 0.18 - t, z1 + ov);
    B.quad(a2, b2, b, a, C.woodDk, M_WOOD); B.quad(e2, g2, g, e, C.woodDk, M_WOOD);
    if (wcol) { B.tri(f(x0, yb, z0), f(x0, yb, z1), f(x0, yt - 0.12, zc), wcol, wmat); B.tri(f(x1, yb, z0), f(x1, yb, z1), f(x1, yt - 0.12, zc), wcol, wmat); }
  }
  function hip(B, f, hw, hd, yb, yt, tw, td, col, mat) {
    var shallowX = (yt - yb) < (hw - tw);
    var p = [f(-hw, yb, -hd), f(hw, yb, -hd), f(hw, yb, hd), f(-hw, yb, hd)], q = [f(-tw, yt, -td), f(tw, yt, -td), f(tw, yt, td), f(-tw, yt, td)];
    var mz = mat, mx = mat == null || mat < 0 ? mat : mat + (shallowX ? 0.5 : 0);
    B.quad(p[3], p[2], q[2], q[3], col, mz); B.quad(p[0], p[1], q[1], q[0], col, mz);
    B.quad(p[1], p[2], q[2], q[1], col, mx); B.quad(p[0], p[3], q[3], q[0], col, mx);
    if (tw > 0.001) { B.quad(q[0], q[1], q[2], q[3], col, mz); }
  }
  function cyl(B, f, cx, cz, r0, r1, y0, y1, seg, col, mat, em, cap, a0) {
    for (var i = 0; i < seg; i++) {
      var t0 = i / seg * TAU + (a0 || 0), t1 = (i + 1) / seg * TAU + (a0 || 0);
      var p0 = f(cx + Math.cos(t0) * r0, y0, cz + Math.sin(t0) * r0), p1 = f(cx + Math.cos(t1) * r0, y0, cz + Math.sin(t1) * r0);
      if (r1 > 0.0001) {
        var p2 = f(cx + Math.cos(t1) * r1, y1, cz + Math.sin(t1) * r1), p3 = f(cx + Math.cos(t0) * r1, y1, cz + Math.sin(t0) * r1);
        B.quad(p0, p1, p2, p3, col, mat, em);
        if (cap) { B.tri(f(cx, y1, cz), p3, p2, col, mat, em); }
      } else { B.tri(p0, p1, f(cx, y1, cz), col, mat, em); }
    }
  }
  var ICO = (function () {
    var t = (1 + Math.sqrt(5)) / 2;
    var nrm = function (v) { var l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
    var mid = function (a, b) { return nrm([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]); };
    var v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(nrm);
    var fc = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    var lo = fc.map(function (tr) { return [v[tr[0]], v[tr[1]], v[tr[2]]]; });
    var hi = [];
    lo.forEach(function (tr) { var ab = mid(tr[0], tr[1]), bc = mid(tr[1], tr[2]), ca = mid(tr[2], tr[0]); hi.push([tr[0], ab, ca], [tr[1], bc, ab], [tr[2], ca, bc], [ab, bc, ca]); });
    return { lo: lo, hi: hi };
  })();
  function ball(B, f, cx, cy, cz, rx, ry, rz, col, mat, em, jit, seed, lo) {
    var F = lo ? ICO.lo : ICO.hi;
    for (var i = 0; i < F.length; i++) {
      var tr = F[i], p = [];
      for (var k = 0; k < 3; k++) {
        var q = tr[k], s = 1;
        if (jit) { s = 1 + (hash2(q[0] * 7.13 + (seed || 0) * 1.7, q[1] * 5.31 + q[2] * 3.77) - 0.5) * jit; }
        p.push(f(cx + q[0] * rx * s, cy + q[1] * ry * s, cz + q[2] * rz * s));
      }
      B.tri(p[0], p[1], p[2], col, mat, em);
    }
  }

  /* ---------- colliders & decoration registry ---------- */
  var COLL = [];
  var TREES = [];
  function coll(x, z, r) { COLL.push({ x: x, z: z, r: r }); }

  /* ---------- buildings ---------- */
  function windowAt(B, f, x, y, z, w, h, frameCol, glassCol, side) {
    var s = side || 1;
    box(B, f, x - w / 2 - 0.1, y - h / 2 - 0.1, z, x + w / 2 + 0.1, y + h / 2 + 0.1, z + 0.06 * s, frameCol, M_WOOD);
    box(B, f, x - w / 2, y - h / 2, z + 0.02 * s, x + w / 2, y + h / 2, z + 0.1 * s, glassCol || C.glass, M_NONE, 1);
    box(B, f, x - 0.04, y - h / 2, z + 0.09 * s, x + 0.04, y + h / 2, z + 0.13 * s, frameCol, M_WOOD);
  }
  function house(B, x, z, gy, o) {
    var f = frame(x, gy, z, 0), w = o.w / 2, d = o.d / 2, h = o.h;
    box(B, f, -w - 0.2, -0.8, -d - 0.2, w + 0.2, 0.3, d + 0.2, C.stoneDk, M_STONE);
    box(B, f, -w, 0.3, -d, w, h, d, o.wall, M_PLASTER);
    box(B, f, -w - 0.06, h - 0.3, -d - 0.06, w + 0.06, h, d + 0.06, C.woodDk, M_WOOD);
    box(B, f, -w - 0.06, 0.3, d - 0.06, -w + 0.22, h, d + 0.06, C.woodDk, M_WOOD);
    box(B, f, w - 0.22, 0.3, d - 0.06, w + 0.06, h, d + 0.06, C.woodDk, M_WOOD);
    gable(B, f, -w, w, -d, d, h, h + o.rh, 0.6, o.roof, M_ROOF, o.wall, M_PLASTER);
    box(B, f, -0.6, 0.3, d, 0.6, 2.15, d + 0.1, o.accent, M_WOOD);
    box(B, f, 0.28, 1.1, d + 0.1, 0.4, 1.3, d + 0.18, C.gold, M_NONE);
    windowAt(B, f, -w * 0.58, 1.75, d, 1.0, 0.95, C.woodDk);
    windowAt(B, f, w * 0.58, 1.75, d, 1.0, 0.95, C.woodDk);
    box(B, f, -w * 0.58 - 0.75, 1.15, d, -w * 0.58 - 0.55, 2.35, d + 0.12, o.accent, M_WOOD);
    box(B, f, w * 0.58 + 0.55, 1.15, d, w * 0.58 + 0.75, 2.35, d + 0.12, o.accent, M_WOOD);
    var fside = frame(x, gy, z, Math.PI / 2);
    windowAt(B, fside, 0, 1.75, w, 0.9, 0.9, C.woodDk);
    var fside2 = frame(x, gy, z, -Math.PI / 2);
    windowAt(B, fside2, 0, 1.75, w, 0.9, 0.9, C.woodDk);
    box(B, f, -1.35, 2.45, d, 1.35, 2.62, d + 1.35, o.roof, M_ROOF);
    box(B, f, -1.2, 0.3, d + 1.1, -1.02, 2.45, d + 1.28, C.wood, M_WOOD);
    box(B, f, 1.02, 0.3, d + 1.1, 1.2, 2.45, d + 1.28, C.wood, M_WOOD);
    box(B, f, w * 0.4, h + 0.4, -d * 0.35, w * 0.4 + 0.65, h + o.rh + 0.5, -d * 0.35 + 0.65, C.brick, M_STONE);
    B.swK = 0.25; B.swB = gy + 0.9;
    [-w * 0.58, w * 0.58].forEach(function (wx) {
      box(B, f, wx - 0.6, 1.05, d + 0.1, wx + 0.6, 1.25, d + 0.45, C.woodDk, M_WOOD);
      ball(B, f, wx - 0.3, 1.38, d + 0.3, 0.26, 0.2, 0.2, o.flower, M_NONE, 0, 0.3, wx, true);
      ball(B, f, wx + 0.28, 1.38, d + 0.3, 0.24, 0.2, 0.2, C.leafC, M_NONE, 0, 0.3, wx + 2, true);
    });
    B.swK = 0;
    for (var i = -3; i <= 3; i++) {
      if (Math.abs(i) < 1) { continue; }
      var fx = i * 1.05;
      box(B, f, fx - 0.07, 0, d + 2.6, fx + 0.07, 0.95, d + 2.72, C.woodLt, M_WOOD);
    }
    box(B, f, -3.2, 0.55, d + 2.62, -1.02, 0.68, d + 2.7, C.woodLt, M_WOOD);
    box(B, f, 1.02, 0.55, d + 2.62, 3.2, 0.68, d + 2.7, C.woodLt, M_WOOD);
    coll(x, z, Math.max(w, d) + 0.55);
    coll(x - w * 0.6, z + d * 0.4, 1.4); coll(x + w * 0.6, z + d * 0.4, 1.4);
  }
  function pendopo(B, x, z, gy) {
    var f = frame(x, gy, z, 0);
    box(B, f, -5.4, -1, -5.4, 5.4, 0.6, 5.4, C.stone, M_STONE);
    box(B, f, -2.8, -1, 5.4, 2.8, 0.4, 6.2, C.stone, M_STONE);
    box(B, f, -2.8, -1, 6.2, 2.8, 0.2, 7.0, C.stoneDk, M_STONE);
    var ring = [-4.7, -1.6, 1.6, 4.7];
    ring.forEach(function (px) { ring.forEach(function (pz) {
      if (Math.abs(px) < 2 && Math.abs(pz) < 2) { return; }
      box(B, f, px - 0.22, 0.6, pz - 0.22, px + 0.22, 3.9, pz + 0.22, C.woodDk, M_WOOD);
      box(B, f, px - 0.3, 0.6, pz - 0.3, px + 0.3, 0.9, pz + 0.3, C.stoneDk, M_STONE);
    }); });
    [-1.6, 1.6].forEach(function (px) { [-1.6, 1.6].forEach(function (pz) {
      box(B, f, px - 0.3, 0.6, pz - 0.3, px + 0.3, 4.9, pz + 0.3, C.red, M_WOOD);
      box(B, f, px - 0.36, 3.2, pz - 0.36, px + 0.36, 3.45, pz + 0.36, C.gold, M_NONE);
      box(B, f, px - 0.36, 1.2, pz - 0.36, px + 0.36, 1.4, pz + 0.36, C.gold, M_NONE);
      box(B, f, px - 0.14, 2.3, pz + 0.36, px + 0.14, 2.75, pz + 0.64, C.glass, M_NONE, 1);
    }); });
    box(B, f, -5.3, 3.9, -5.3, 5.3, 4.15, 5.3, C.woodDk, M_WOOD);
    hip(B, f, 6.3, 6.3, 3.95, 5.35, 2.75, 2.75, C.roof2, M_ROOF);
    box(B, f, -2.75, 4.9, -2.75, 2.75, 5.45, 2.75, C.woodDk, M_WOOD);
    hip(B, f, 2.95, 2.95, 5.35, 8.5, 0.5, 0.5, C.roof2, M_ROOF);
    box(B, f, -0.55, 8.4, -0.55, 0.55, 8.8, 0.55, C.gold, M_NONE);
    cyl(B, f, 0, 0, 0.35, 0, 8.8, 9.7, 6, C.gold, M_NONE, 0);
    box(B, f, -2.2, 0.6, -3.2, 2.2, 1.0, -1.7, C.cream, M_NONE);
    box(B, f, -2.3, 1.0, -3.3, 2.3, 3.4, -3.1, C.gold, M_NONE);
    box(B, f, -1.95, 1.05, -3.12, 1.95, 3.05, -3.05, C.cream, M_PLASTER);
    [-0.7, 0.7].forEach(function (cx) {
      box(B, f, cx - 0.38, 1.0, -2.95, cx + 0.38, 1.45, -2.2, C.white, M_NONE);
      box(B, f, cx - 0.38, 1.45, -2.95, cx + 0.38, 2.3, -2.8, C.white, M_NONE);
    });
    B.swK = 0.35; B.swB = gy + 0.9;
    [-2.05, 2.05].forEach(function (px) {
      ball(B, f, px, 1.35, -2.2, 0.42, 0.34, 0.42, C.pink, M_NONE, 0, 0.35, px, true);
      ball(B, f, px, 1.75, -2.2, 0.3, 0.26, 0.3, C.white, M_NONE, 0, 0.35, px + 3, true);
      cyl(B, f, px, -2.2, 0.28, 0.22, 0.6, 1.05, 6, C.woodDk, M_WOOD, 0, true);
    });
    [-2.4, 2.4].forEach(function (px) {
      cyl(B, f, px, 6.5, 0.07, 0.05, 0.2, 3.6, 5, C.janur, M_NONE);
      for (var k = 0; k < 5; k++) {
        var a = k / 5 * TAU + px;
        B.tri(f(px, 3.5, 6.5), f(px + Math.cos(a) * 0.9, 2.3 - k * 0.1, 6.5 + Math.sin(a) * 0.9), f(px + Math.cos(a + 0.3) * 0.7, 2.6, 6.5 + Math.sin(a + 0.3) * 0.7), C.janur, M_NONE);
      }
    });
    B.swK = 0;
    coll(x, z, 5.9);
  }
  function gapura(B, x, z, gy) {
    var f = frame(x, gy, z, 0);
    [-2.5, 2.5].forEach(function (px) {
      box(B, f, px - 0.55, -0.6, -0.55, px + 0.55, 4.1, 0.55, C.brick, M_STONE);
      box(B, f, px - 0.7, 4.1, -0.7, px + 0.7, 4.45, 0.7, C.stoneDk, M_STONE);
      hip(B, f, 0.62, 0.62, 4.45, 5.3, 0.1, 0.1, C.brick, M_STONE);
      coll(x + px, z, 0.85);
    });
    for (var i = 0; i < 8; i++) {
      var a0 = i / 8 * Math.PI, a1 = (i + 1) / 8 * Math.PI;
      var x0 = -2.5 * Math.cos(a0), y0 = 4.25 + 1.25 * Math.sin(a0), x1 = -2.5 * Math.cos(a1), y1 = 4.25 + 1.25 * Math.sin(a1);
      box(B, f, Math.min(x0, x1) - 0.02, Math.min(y0, y1) - 0.12, -0.14, Math.max(x0, x1) + 0.02, Math.max(y0, y1) + 0.12, 0.14, C.leafD, M_NONE);
    }
    box(B, f, -1.5, 4.55, -0.08, 1.5, 5.25, 0.08, C.cream, M_WOOD);
    B.swK = 0.5; B.swB = gy + 2.5;
    [-2.5, 2.5].forEach(function (px) {
      var sgn = px < 0 ? -1 : 1;
      for (var k = 0; k < 6; k++) {
        var t0 = k / 6, t1 = (k + 1) / 6;
        var ax = px + sgn * (0.6 + t0 * 1.6), ay = 5.2 - t0 * t0 * 3.2, bx = px + sgn * (0.6 + t1 * 1.6), by = 5.2 - t1 * t1 * 3.2;
        B.quad(f(ax, ay, 0.1), f(bx, by, 0.1), f(bx, by - 0.16, 0.1), f(ax, ay - 0.16, 0.1), C.janur, M_NONE);
      }
    });
    B.swK = 0;
    var fb = frame(x + 3.9, gy, z + 0.6, -0.3);
    box(B, fb, -0.08, 0, -0.08, 0.08, 1.9, 0.08, C.woodDk, M_WOOD);
    box(B, fb, 0.9, 0, -0.08, 1.06, 1.9, 0.08, C.woodDk, M_WOOD);
    box(B, fb, -0.2, 0.9, -0.05, 1.18, 2.1, 0.08, C.wood, M_WOOD);
    box(B, fb, -0.05, 1.05, 0.08, 1.0, 1.95, 0.12, C.cream, M_NONE);
    coll(x + 4.3, z + 0.4, 0.8);
  }
  function tower(B, x, z, gy) {
    var f = frame(x, gy, z, 0);
    box(B, f, -2.1, -1.4, -2.1, 2.1, 0.45, 2.1, C.stoneDk, M_STONE);
    cyl(B, f, 0, 0, 2.2, 1.55, 0.45, 9.6, 4, C.stone, M_STONE, 0, false, Math.PI / 4);
    box(B, f, -0.55, 0.45, 1.48, 0.55, 2.35, 1.62, C.door, M_WOOD);
    [3.4, 5.6, 7.8].forEach(function (y) {
      box(B, f, -0.16, y - 0.45, 1.25 - (y - 0.45) * 0.058, 0.16, y + 0.45, 1.36 - (y - 0.45) * 0.058, C.cyan, M_NONE, 1);
    });
    box(B, f, -2.4, 9.6, -2.4, 2.4, 9.95, 2.4, C.woodDk, M_WOOD);
    for (var i = 0; i < 8; i++) {
      var s = i / 8 * 4.6 - 2.3 + 0.29;
      box(B, f, s - 0.06, 9.95, -2.36, s + 0.06, 10.75, -2.24, C.wood, M_WOOD);
      box(B, f, s - 0.06, 9.95, 2.24, s + 0.06, 10.75, 2.36, C.wood, M_WOOD);
      box(B, f, -2.36, 9.95, s - 0.06, -2.24, 10.75, s + 0.06, C.wood, M_WOOD);
      box(B, f, 2.24, 9.95, s - 0.06, 2.36, 10.75, s + 0.06, C.wood, M_WOOD);
    }
    box(B, f, -2.4, 10.7, -2.4, 2.4, 10.85, 2.4, C.woodDk, M_WOOD);
    box(B, f, -1.2, 9.95, -1.2, 1.2, 11.8, 1.2, C.stone, M_STONE);
    box(B, f, -0.4, 10.6, 1.19, 0.4, 11.4, 1.26, C.cyan, M_NONE, 2);
    hip(B, f, 1.7, 1.7, 11.8, 13.9, 0, 0, C.roofB, M_ROOF);
    cyl(B, f, 0, 0, 0.06, 0.04, 13.8, 16.2, 5, C.dark, M_NONE);
    ball(B, f, 0, 16.3, 0, 0.18, 0.18, 0.18, C.cyan, M_NONE, 2, 0, 0, true);
    coll(x, z, 2.5);
  }
  function inn(B, x, z, gy) {
    var f = frame(x, gy, z, 0), w = 3.6, d = 2.6;
    box(B, f, -w - 0.2, -0.8, -d - 0.2, w + 0.2, 0.3, d + 0.2, C.stoneDk, M_STONE);
    box(B, f, -w, 0.3, -d, w, 3.2, d, C.woodLt, M_WOOD);
    box(B, f, -w - 0.12, 3.2, -d - 0.12, w + 0.12, 3.45, d + 0.12, C.woodDk, M_WOOD);
    box(B, f, -w, 3.45, -d, w, 6.1, d, C.wallB, M_PLASTER);
    gable(B, f, -w, w, -d, d, 6.1, 8.3, 0.65, C.roofB, M_ROOF, C.wallB, M_PLASTER);
    box(B, f, -0.7, 0.3, d, 0.7, 2.4, d + 0.1, C.door, M_WOOD);
    [-2.4, -1.2, 1.2, 2.4].forEach(function (wx) { windowAt(B, f, wx, 1.8, d, 0.75, 0.9, C.woodDk); });
    [-2.6, -0.9, 0.9, 2.6].forEach(function (wx) { windowAt(B, f, wx, 4.8, d, 0.8, 1.0, C.woodDk); });
    box(B, f, -w, 3.45, d, w, 3.6, d + 1.1, C.woodDk, M_WOOD);
    for (var i = 0; i < 12; i++) { var bx = -w + 0.3 + i * 0.6; box(B, f, bx - 0.04, 3.6, d + 1.0, bx + 0.04, 4.2, d + 1.08, C.wood, M_WOOD); }
    box(B, f, -w, 4.18, d + 0.98, w, 4.28, d + 1.1, C.wood, M_WOOD);
    box(B, f, -w + 0.15, 0.3, d + 0.95, -w + 0.35, 3.45, d + 1.12, C.woodDk, M_WOOD);
    box(B, f, w - 0.35, 0.3, d + 0.95, w - 0.15, 3.45, d + 1.12, C.woodDk, M_WOOD);
    box(B, f, 1.0, 2.6, d + 0.1, 1.12, 2.72, d + 0.9, C.dark, M_NONE);
    box(B, f, 1.02, 1.7, d + 0.72, 1.1, 2.6, d + 1.6, C.wood, M_WOOD);
    box(B, f, -1.05, 1.9, d + 0.12, -0.9, 2.3, d + 0.3, C.glass, M_NONE, 1);
    box(B, f, 0.9, 1.9, d + 0.12, 1.05, 2.3, d + 0.3, C.glass, M_NONE, 1);
    box(B, f, -3.1, 0.3, d + 1.6, -1.6, 0.75, d + 2.1, C.wood, M_WOOD);
    coll(x, z, 4.1);
  }
  function trophyHall(B, x, z, gy) {
    var f = frame(x, gy, z, 0), w = 2.8, d = 2.3;
    box(B, f, -w - 0.5, -0.8, -d - 0.5, w + 0.5, 0.45, d + 1.4, C.stone, M_STONE);
    box(B, f, -w, 0.45, -d, w, 3.4, d - 0.2, C.white, M_PLASTER);
    [-2.2, -0.8, 0.8, 2.2].forEach(function (cx) { cyl(B, f, cx, d + 0.55, 0.26, 0.22, 0.45, 3.4, 7, C.white, M_STONE, 0, true); box(B, f, cx - 0.34, 3.3, d + 0.2, cx + 0.34, 3.5, d + 0.9, C.stone, M_STONE); });
    box(B, f, -w - 0.2, 3.4, -d - 0.2, w + 0.2, 3.7, d + 1.2, C.stone, M_STONE);
    gable(B, frame(x, gy, z, Math.PI / 2), -d - 0.2, d + 1.2, -w - 0.2, w + 0.2, 3.7, 5.1, 0.15, C.stone, M_STONE, C.white, M_PLASTER);
    box(B, f, -0.7, 0.45, d - 0.2, 0.7, 2.6, d - 0.1, C.door, M_WOOD);
    cyl(B, f, 0, 0, 0.55, 0.65, 5.0, 5.35, 8, C.gold, M_NONE, 0, true);
    cyl(B, f, 0, 0, 0.16, 0.16, 5.35, 5.9, 6, C.gold, M_NONE);
    cyl(B, f, 0, 0, 0.18, 0.85, 5.9, 7.1, 10, C.gold, M_NONE, 0, true);
    [-1, 1].forEach(function (s) { box(B, f, s * 0.8, 6.2, -0.08, s * 1.05, 6.95, 0.08, C.gold, M_NONE); });
    coll(x, z + 0.3, 3.4);
  }
  function studio(B, x, z, gy) {
    var f = frame(x, gy, z, 0), w = 2.6, d = 2.3;
    box(B, f, -w - 0.2, -0.8, -d - 0.2, w + 0.2, 0.3, d + 0.2, C.stoneDk, M_STONE);
    box(B, f, -w, 0.3, -d, w, 3.6, d, C.wallP, M_PLASTER);
    box(B, f, -w - 0.2, 3.6, -d - 0.2, w + 0.2, 3.95, d + 0.2, C.pink, M_NONE);
    box(B, f, -w + 0.1, 3.95, -d + 0.1, w - 0.1, 4.05, d - 0.1, C.stoneDk, M_STONE);
    for (var i = 0; i < 5; i++) { box(B, f, -w + i * 1.04, 0.3, d, -w + i * 1.04 + 0.52, 0.7, d + 0.05, i % 2 ? C.pink : C.cream, M_NONE); }
    var fl = frame(x, gy, z + d, 0, Math.PI / 2);
    cyl(B, fl, 0.9, 1.9, 1.05, 1.05, 0, 0.35, 12, C.dark, M_NONE, 0, true);
    cyl(B, fl, 0.9, 1.9, 0.78, 0.78, 0.35, 0.5, 12, C.cyan, M_NONE, 1, true);
    box(B, f, -2.1, 0.3, d, -1.1, 2.3, d + 0.1, C.door, M_WOOD);
    box(B, f, -w + 0.2, 3.95, -0.4, -w + 1.1, 4.5, 0.4, C.dark, M_NONE);
    box(B, f, -w + 0.35, 4.5, -0.25, -w + 0.95, 4.7, 0.25, C.glass, M_NONE, 2);
    var ft = frame(x + 3.8, gy, z + 2.2, -0.6);
    [[0, 0.3], [0.3, -0.2], [-0.3, -0.2]].forEach(function (l) { box(B, ft, l[0] - 0.04, 0, l[1] - 0.04, l[0] * 0.2 + 0.04, 1.4, l[1] * 0.2 + 0.04, C.dark, M_NONE); });
    box(B, ft, -0.3, 1.4, -0.2, 0.3, 1.8, 0.2, C.dark, M_NONE);
    cyl(B, frame(x + 3.8, gy + 1.6, z + 2.2, -0.6, Math.PI / 2), 0, 0, 0.14, 0.14, 0.2, 0.45, 8, C.stoneDk, M_NONE, 0, true);
    coll(x, z, 3.4); coll(x + 3.8, z + 2.2, 0.6);
  }
  function cinema(B, x, z, gy) {
    var f = frame(x, gy, z, 0), w = 3.1, d = 2.6;
    box(B, f, -w - 0.2, -0.8, -d - 0.2, w + 0.2, 0.3, d + 0.2, C.stoneDk, M_STONE);
    box(B, f, -w, 0.3, -d, w, 4.3, d, hex("#7a2b3b"), M_PLASTER);
    box(B, f, -w - 0.15, 4.3, -d - 0.15, w + 0.15, 4.6, d + 0.15, C.gold, M_NONE);
    box(B, f, -w + 0.2, 4.6, -d + 0.2, w - 0.2, 4.7, d - 0.2, C.stoneDk, M_STONE);
    box(B, f, -2.2, 2.7, d, 2.2, 3.0, d + 1.3, C.dark, M_NONE);
    for (var i = 0; i < 9; i++) { var bx = -2.05 + i * 0.51; box(B, f, bx - 0.08, 2.62, d + 1.22, bx + 0.08, 2.72, d + 1.32, C.glass, M_NONE, 2); }
    box(B, f, -2.05, 3.0, d + 1.1, 2.05, 3.7, d + 1.25, C.cream, M_NONE, 1);
    box(B, f, -1.0, 0.3, d, 1.0, 2.5, d + 0.1, C.dark, M_NONE);
    box(B, f, -2.8, 1.0, d, -1.6, 2.5, d + 0.08, C.purple, M_NONE);
    box(B, f, 1.6, 1.0, d, 2.8, 2.5, d + 0.08, C.teal, M_NONE);
    box(B, f, w - 0.1, 2.5, 0.2, w + 0.35, 6.4, 1.4, C.red, M_NONE);
    for (var k = 0; k < 6; k++) { box(B, f, w + 0.35, 2.9 + k * 0.58, 0.55, w + 0.4, 3.25 + k * 0.58, 1.05, C.glass, M_NONE, 1); }
    coll(x, z, 3.8);
  }
  function boutique(B, x, z, gy) {
    var f = frame(x, gy, z, 0), w = 2.3, d = 1.8;
    box(B, f, -w - 0.2, -0.8, -d - 0.2, w + 0.2, 0.3, d + 0.2, C.stoneDk, M_STONE);
    box(B, f, -w, 0.3, -d, w, 3.0, d, hex("#f3e6ff"), M_PLASTER);
    gable(B, frame(x, gy, z, Math.PI / 2), -d, d, -w, w, 3.0, 4.4, 0.45, C.purple, M_ROOF, hex("#f3e6ff"), M_PLASTER);
    for (var i = 0; i < 6; i++) {
      var ax = -w - 0.2 + i * (2 * w + 0.4) / 6, bx = ax + (2 * w + 0.4) / 6;
      B.quad(f(ax, 2.55, d), f(bx, 2.55, d), f(bx, 2.05, d + 1.2), f(ax, 2.05, d + 1.2), i % 2 ? C.white : C.purple, M_NONE);
    }
    box(B, f, -1.9, 0.9, d, -0.3, 2.2, d + 0.08, hex("#cfe9ff"), M_NONE, 1);
    box(B, f, 0.4, 0.3, d, 1.5, 2.3, d + 0.1, C.door, M_WOOD);
    cyl(B, f, -1.1, d - 0.35, 0.18, 0.28, 0.3, 1.5, 6, hex("#5aa857"), M_NONE, 0, true);
    ball(B, f, -1.1, 1.72, d - 0.35, 0.18, 0.2, 0.18, hex("#f5cda5"), M_NONE, 0, 0, 0, true);
    coll(x, z, 2.9);
  }
  function questBoard(B, x, z, gy) {
    var f = frame(x, gy, z, 0.25);
    box(B, f, -1.65, -0.3, -0.12, -1.45, 2.5, 0.12, C.woodDk, M_WOOD);
    box(B, f, 1.45, -0.3, -0.12, 1.65, 2.5, 0.12, C.woodDk, M_WOOD);
    box(B, f, -1.5, 0.7, -0.06, 1.5, 2.25, 0.08, C.wood, M_WOOD);
    gable(B, f, -1.8, 1.8, -0.45, 0.45, 2.4, 2.9, 0.1, C.roof, M_ROOF);
    var notes = [[-1.1, 1.8, C.cream], [-0.3, 1.9, hex("#fff1b8")], [0.5, 1.75, C.cream], [1.1, 1.85, hex("#ffd6de")], [-0.8, 1.15, hex("#dff3ff")], [0.2, 1.2, C.cream], [1.0, 1.1, hex("#fff1b8")]];
    notes.forEach(function (n) { box(B, f, n[0] - 0.26, n[1] - 0.3, 0.08, n[0] + 0.26, n[1] + 0.3, 0.11, n[2], M_NONE); box(B, f, n[0] - 0.05, n[1] + 0.2, 0.11, n[0] + 0.05, n[1] + 0.28, 0.14, C.red, M_NONE); });
    coll(x, z, 1.7);
  }
  function guildHall(B, x, z, gy) {
    var f = frame(x, gy, z, 0), w = 2.5, d = 2.0;
    box(B, f, -w - 0.2, -0.8, -d - 0.2, w + 0.2, 0.3, d + 0.2, C.stoneDk, M_STONE);
    box(B, f, -w, 0.3, -d, w, 3.0, d, C.wood, M_WOOD);
    gable(B, frame(x, gy, z, Math.PI / 2), -d, d, -w, w, 3.0, 5.4, 0.5, C.roofG, M_ROOF, C.woodLt, M_WOOD);
    box(B, f, -0.75, 0.3, d, 0.75, 2.4, d + 0.1, C.door, M_WOOD);
    cyl(B, frame(x, gy, z + d + 0.05, 0, Math.PI / 2), 0, -3.9, 0.55, 0.55, 0, 0.12, 8, C.blue, M_NONE, 0, true);
    windowAt(B, f, -1.7, 1.7, d, 0.7, 0.8, C.woodDk);
    windowAt(B, f, 1.7, 1.7, d, 0.7, 0.8, C.woodDk);
    [-3.2, 3.2].forEach(function (px) {
      cyl(B, f, px, d + 0.6, 0.06, 0.05, 0, 4.4, 5, C.woodDk, M_WOOD);
      B.swK = 0.9; B.swB = gy + 3.3;
      B.quad(f(px, 4.3, d + 0.6), f(px + (px < 0 ? 1.2 : -1.2), 4.1, d + 0.6), f(px + (px < 0 ? 1.2 : -1.2), 3.55, d + 0.6), f(px, 3.4, d + 0.6), px < 0 ? C.pink : C.blue, M_NONE);
      B.swK = 0;
    });
    coll(x, z, 3.1);
  }
  function well(B, x, z, gy) {
    var f = frame(x, gy, z, 0.3);
    cyl(B, f, 0, 0, 1.0, 1.0, -0.2, 0.95, 10, C.stone, M_STONE, 0, false);
    cyl(B, f, 0, 0, 0.78, 0.78, -0.2, 0.95, 10, C.stoneDk, M_STONE, 0, false);
    for (var i = 0; i < 10; i++) {
      var a0 = i / 10 * TAU, a1 = (i + 1) / 10 * TAU;
      B.quad(f(Math.cos(a0) * 0.78, 0.95, Math.sin(a0) * 0.78), f(Math.cos(a1) * 0.78, 0.95, Math.sin(a1) * 0.78), f(Math.cos(a1) * 1.02, 0.95, Math.sin(a1) * 1.02), f(Math.cos(a0) * 1.02, 0.95, Math.sin(a0) * 1.02), C.stone, M_STONE);
    }
    cyl(B, f, 0, 0, 0.78, 0.78, 0.55, 0.56, 10, hex("#2a8fb8"), M_NONE, 0, true);
    box(B, f, -1.05, 0.9, -0.1, -0.88, 2.6, 0.1, C.woodDk, M_WOOD);
    box(B, f, 0.88, 0.9, -0.1, 1.05, 2.6, 0.1, C.woodDk, M_WOOD);
    gable(B, f, -1.3, 1.3, -0.8, 0.8, 2.5, 3.25, 0.1, C.roof, M_ROOF);
    cyl(B, frame(x, gy + 2.2, z, 0.3, 0, Math.PI / 2), 0, 0, 0.07, 0.07, -0.9, 0.9, 6, C.wood, M_WOOD);
    box(B, f, -0.2, 1.3, -0.15, 0.2, 1.6, 0.15, C.wood, M_WOOD);
    coll(x, z, 1.35);
  }
  function campfire(B, x, z, gy) {
    var f = frame(x, gy, z, 0);
    for (var i = 0; i < 9; i++) { var a = i / 9 * TAU; ball(B, f, Math.cos(a) * 0.72, 0.1, Math.sin(a) * 0.72, 0.2, 0.15, 0.18, C.stoneDk, M_ROCK, 0, 0.3, i, true); }
    box(B, frame(x, gy + 0.18, z, 0.5), -0.6, -0.08, -0.09, 0.6, 0.08, 0.09, C.woodDk, M_WOOD);
    box(B, frame(x, gy + 0.2, z, -0.6), -0.6, -0.08, -0.09, 0.6, 0.08, 0.09, C.trunk, M_WOOD);
    var ft = frame(x - 2.2, gy, z - 1.4, 0.5);
    B.quad(ft(-1.2, 0, -0.9), ft(0, 1.7, -0.9), ft(0, 1.7, 0.9), ft(-1.2, 0, 0.9), C.orange, M_NONE);
    B.quad(ft(1.2, 0, -0.9), ft(0, 1.7, -0.9), ft(0, 1.7, 0.9), ft(1.2, 0, 0.9), hex("#f0a23b"), M_NONE);
    B.tri(ft(-1.2, 0, -0.9), ft(1.2, 0, -0.9), ft(0, 1.7, -0.9), hex("#e28e2c"), M_NONE);
    B.tri(ft(-0.45, 0, 0.9), ft(0.45, 0, 0.9), ft(0, 1.1, 0.95), C.woodDk, M_NONE);
    [[1.6, 0.3, 0.2], [-0.2, 1.7, 1.45]].forEach(function (s) {
      cyl(B, frame(x + s[0], gy + 0.3, z + s[1], s[2], 0, Math.PI / 2), 0, 0, 0.26, 0.26, -0.8, 0.8, 7, C.trunk, M_WOOD, 0, true);
      coll(x + s[0], z + s[1], 0.6);
    });
    coll(x, z, 0.95); coll(x - 2.2, z - 1.4, 1.2);
  }
  function arbor(B, x, z, gy) {
    var f = frame(x, gy, z, 0);
    [-1.5, 1.5].forEach(function (px) { box(B, f, px - 0.12, 0, -0.12, px + 0.12, 2.6, 0.12, C.white, M_WOOD); coll(x + px, z, 0.35); });
    for (var i = 0; i < 9; i++) {
      var a0 = i / 9 * Math.PI, a1 = (i + 1) / 9 * Math.PI;
      box(B, f, Math.min(-1.5 * Math.cos(a0), -1.5 * Math.cos(a1)), 2.55 + Math.min(Math.sin(a0), Math.sin(a1)) * 0.9, -0.1, Math.max(-1.5 * Math.cos(a0), -1.5 * Math.cos(a1)), 2.7 + Math.max(Math.sin(a0), Math.sin(a1)) * 0.9, 0.1, C.white, M_WOOD);
    }
    B.swK = 0.3; B.swB = gy + 2;
    for (var k = 0; k < 14; k++) {
      var a = k / 13 * Math.PI, px = -1.5 * Math.cos(a), py = 2.65 + Math.sin(a) * 0.9;
      ball(B, f, px, py, 0.12, 0.2, 0.2, 0.2, k % 3 === 0 ? C.pink : k % 3 === 1 ? C.white : C.leafC, M_NONE, 0, 0.4, k, true);
    }
    B.swK = 0;
    [[-3.2, 1.8, 0.4], [3.4, 1.4, -0.5]].forEach(function (s) {
      var fb = frame(x + s[0], gy, z + s[1], s[2]);
      box(B, fb, -0.9, 0.42, -0.25, 0.9, 0.52, 0.25, C.wood, M_WOOD);
      box(B, fb, -0.9, 0.52, -0.3, 0.9, 1.05, -0.2, C.wood, M_WOOD);
      box(B, fb, -0.85, 0, -0.2, -0.7, 0.42, 0.2, C.woodDk, M_WOOD); box(B, fb, 0.7, 0, -0.2, 0.85, 0.42, 0.2, C.woodDk, M_WOOD);
      coll(x + s[0], z + s[1], 0.9);
    });
  }
  function shipwreck(B, x, z, gy) {
    var f = frame(x, gy - 0.35, z, 0.9, 0.12, 0.35);
    var ribs = 6;
    for (var i = 0; i < ribs; i++) {
      var t0 = i / ribs, t1 = (i + 1) / ribs;
      var w0 = 1.2 * Math.sin(Math.PI * (0.15 + t0 * 0.8)), w1 = 1.2 * Math.sin(Math.PI * (0.15 + t1 * 0.8));
      var z0 = -2.6 + t0 * 5.2, z1 = -2.6 + t1 * 5.2;
      B.quad(f(-w0, 1.3, z0), f(-w1, 1.3, z1), f(-w1 * 0.3, 0, z1), f(-w0 * 0.3, 0, z0), C.woodDk, M_WOOD);
      if (i % 2 === 0 || i > 3) { B.quad(f(w0, 1.3, z0), f(w1, 1.3, z1), f(w1 * 0.3, 0, z1), f(w0 * 0.3, 0, z0), C.wood, M_WOOD); }
    }
    box(B, f, -0.08, 0.6, -0.4, 0.08, 3.4, -0.25, C.woodDk, M_WOOD);
    B.swK = 0.35; B.swB = gy + 1.6;
    B.quad(f(0.08, 3.2, -0.3), f(1.3, 2.3, -0.1), f(1.1, 1.4, 0.2), f(0.08, 1.7, -0.2), C.sail, M_NONE);
    B.swK = 0;
    var fc = frame(x + 1.7, gy, z - 0.4, 0.3);
    box(B, fc, -0.45, 0, -0.3, 0.45, 0.5, 0.3, C.wood, M_WOOD);
    box(B, fc, -0.47, 0.5, -0.32, 0.47, 0.7, 0.32, C.woodDk, M_WOOD);
    box(B, fc, -0.08, 0.3, 0.3, 0.08, 0.55, 0.36, C.gold, M_NONE);
    box(B, fc, -0.47, 0.18, -0.33, 0.47, 0.26, 0.33, C.gold, M_NONE);
    [[-1.4, 1.6], [2.2, 1.3], [-0.6, 2.3]].forEach(function (p, i) { box(B, frame(x + p[0], gy + 0.05, z + p[1], i * 1.1), -0.7, 0, -0.08, 0.7, 0.07, 0.08, C.woodLt, M_WOOD); });
    coll(x, z, 2.1); coll(x + 1.7, z - 0.4, 0.6);
  }
  function monolith(B, x, z, gy) {
    var f = frame(x, gy, z, 0.15);
    box(B, f, -0.75, -0.4, -0.3, 0.75, 2.9, 0.3, hex("#7d8a8f"), M_ROCK);
    hip(B, f, 0.75, 0.3, 2.9, 3.4, 0.25, 0.12, hex("#7d8a8f"), M_ROCK);
    [0.7, 1.2, 1.7, 2.2].forEach(function (y, i) { box(B, f, -0.45 + (i % 2) * 0.1, y, 0.3, 0.45 - (i % 2) * 0.12, y + 0.08, 0.34, C.cyan, M_NONE, 2); });
    box(B, f, -0.06, 2.45, 0.3, 0.06, 2.75, 0.34, C.cyan, M_NONE, 2);
    for (var i = 0; i < 7; i++) { var a = i / 7 * TAU + 0.4; ball(B, f, Math.cos(a) * 1.7, 0.15, Math.sin(a) * 1.3, 0.28, 0.32, 0.26, C.stoneDk, M_ROCK, 0, 0.4, i + 3, true); }
    coll(x, z, 1.1);
  }
  function pier(B, gy0) {
    var f = frame(0, 0, 0, 0), dy = 0.62;
    box(B, f, -1.5, dy - 0.14, 28.4, 1.5, dy, 40.4, C.woodLt, M_WOOD);
    for (var z = 29; z <= 40; z += 2.2) {
      [-1.35, 1.35].forEach(function (px) { cyl(B, f, px, z, 0.13, 0.13, -3, dy + 0.5, 6, C.woodDk, M_WOOD, 0, true); });
    }
    [31.2, 35.6, 40].forEach(function (z) {
      cyl(B, f, 1.35, z, 0.06, 0.05, dy + 0.5, dy + 2.2, 5, C.dark, M_NONE);
      box(B, f, 1.2, dy + 2.2, z - 0.15, 1.5, dy + 2.55, z + 0.15, C.glass, M_NONE, 1);
    });
    var fa = frame(0, gy0, 27.4, 0);
    [-2.1, 2.1].forEach(function (px) { box(B, fa, px - 0.2, -0.5, -0.2, px + 0.2, 3.3, 0.2, C.wood, M_WOOD); coll(px, 27.4, 0.4); });
    box(B, fa, -2.5, 3.3, -0.25, 2.5, 3.55, 0.25, C.woodDk, M_WOOD);
    box(B, fa, -1.6, 2.35, -0.06, 1.6, 3.2, 0.08, C.cream, M_NONE);
    B.swK = 0.4; B.swB = gy0 + 2.8;
    for (var i = 0; i < 7; i++) { var bx = -1.8 + i * 0.6; B.tri(fa(bx, 3.3, 0.26), fa(bx + 0.5, 3.3, 0.26), fa(bx + 0.25, 2.85, 0.27), i % 2 ? C.pink : C.janur, M_NONE); }
    B.swK = 0;
  }
  function windmillBase(B, x, z, gy) {
    var f = frame(x, gy, z, 0.6);
    cyl(B, f, 0, 0, 1.35, 0.9, -0.5, 5.2, 8, C.wall, M_PLASTER, 0, false);
    hip(B, f, 1.05, 1.05, 5.2, 6.6, 0, 0, C.roof, M_ROOF);
    box(B, f, -0.4, -0.5, 1.12, 0.4, 1.6, 1.3, C.door, M_WOOD);
    coll(x, z, 1.6);
  }
  function lamp(B, x, z, gy) {
    var f = frame(x, gy, z, 0);
    cyl(B, f, 0, 0, 0.08, 0.06, 0, 2.5, 5, C.dark, M_NONE);
    box(B, f, -0.2, 2.5, -0.2, 0.2, 2.95, 0.2, C.glass, M_NONE, 1);
    hip(B, f, 0.28, 0.28, 2.95, 3.2, 0, 0, C.dark, M_NONE);
  }
  function bench(B, x, z, gy, ry) {
    var f = frame(x, gy, z, ry);
    box(B, f, -0.9, 0.42, -0.25, 0.9, 0.52, 0.25, C.wood, M_WOOD);
    box(B, f, -0.9, 0.52, -0.3, 0.9, 1.05, -0.22, C.wood, M_WOOD);
    box(B, f, -0.85, 0, -0.2, -0.7, 0.42, 0.2, C.woodDk, M_WOOD); box(B, f, 0.7, 0, -0.2, 0.85, 0.42, 0.2, C.woodDk, M_WOOD);
    coll(x, z, 0.9);
  }

  /* ---------- vegetation ---------- */
  function roundTree(B, x, z, gy, s, seed) {
    var f = frame(x, gy, z, seed);
    cyl(B, f, 0, 0, 0.24 * s, 0.16 * s, -0.3, 1.9 * s, 6, C.trunk, M_WOOD);
    var cols = [C.leafA, C.leafB, C.leafC, C.leafD];
    var c1 = cols[Math.floor(hash2(seed, 1.3) * 4)], c2 = mixC(c1, C.leafC, 0.35);
    B.swK = 0.22 / s; B.swB = gy + 1.5 * s;
    ball(B, f, 0, 2.55 * s, 0, 1.3 * s, 1.1 * s, 1.3 * s, c1, M_NONE, 0, 0.32, seed);
    ball(B, f, 0.45 * s, 3.25 * s, 0.25 * s, 0.82 * s, 0.72 * s, 0.82 * s, c2, M_NONE, 0, 0.3, seed + 1);
    if (hash2(seed, 7.7) > 0.6) { ball(B, f, -0.5 * s, 3.0 * s, -0.4 * s, 0.7 * s, 0.6 * s, 0.7 * s, c2, M_NONE, 0, 0.3, seed + 2, true); }
    if (hash2(seed, 3.1) > 0.72) { for (var k = 0; k < 5; k++) { var a = k * 1.3 + seed; ball(B, f, Math.cos(a) * 1.05 * s, 2.4 * s + k * 0.15, Math.sin(a) * 1.05 * s, 0.1, 0.1, 0.1, hash2(seed, 2) > 0.5 ? C.pink : C.white, M_NONE, 0, 0, 0, true); } }
    B.swK = 0;
    coll(x, z, 0.45 * s); TREES.push([x, z, 1.1 * s, 0]);
  }
  function pineTree(B, x, z, gy, s, seed) {
    var f = frame(x, gy, z, seed);
    cyl(B, f, 0, 0, 0.2 * s, 0.14 * s, -0.3, 1.3 * s, 5, C.trunk, M_WOOD);
    B.swK = 0.12 / s; B.swB = gy + 1.2 * s;
    cyl(B, f, 0, 0, 1.25 * s, 0, 1.0 * s, 3.0 * s, 7, C.leafD, M_NONE, 0, false, seed);
    cyl(B, f, 0, 0, 1.0 * s, 0, 2.0 * s, 3.8 * s, 7, mixC(C.leafD, C.leafB, 0.4), M_NONE, 0, false, seed + 0.4);
    cyl(B, f, 0, 0, 0.7 * s, 0, 2.9 * s, 4.6 * s, 6, C.leafB, M_NONE, 0, false, seed + 0.8);
    B.swK = 0;
    coll(x, z, 0.4 * s); TREES.push([x, z, 0.9 * s, 1]);
  }
  function palmTree(B, x, z, gy, s, seed) {
    var lean = hash2(seed, 2.2) * TAU, lx = Math.cos(lean), lz = Math.sin(lean), H = 3.9 * s;
    var prev = [x, gy - 0.3, z];
    for (var i = 1; i <= 6; i++) {
      var t = i / 6, bend = t * t * 1.3 * s;
      var p = [x + lx * bend, gy + t * H, z + lz * bend];
      var r0 = 0.22 * s * (1 - (i - 1) / 6 * 0.45), r1 = 0.22 * s * (1 - i / 6 * 0.45);
      var fa = frame(prev[0], 0, prev[2], 0), fb = frame(p[0], 0, p[2], 0);
      for (var k = 0; k < 5; k++) {
        var a0 = k / 5 * TAU, a1 = (k + 1) / 5 * TAU;
        B.quad(fa(Math.cos(a0) * r0, prev[1], Math.sin(a0) * r0), fa(Math.cos(a1) * r0, prev[1], Math.sin(a1) * r0), fb(Math.cos(a1) * r1, p[1], Math.sin(a1) * r1), fb(Math.cos(a0) * r1, p[1], Math.sin(a0) * r1), i % 2 ? C.trunk : C.woodLt, M_WOOD);
      }
      prev = p;
    }
    var top = prev;
    B.swK = 0.28; B.swB = top[1] - 1;
    for (var j = 0; j < 7; j++) {
      var a = j / 7 * TAU + seed, cx = Math.cos(a), cz = Math.sin(a), L = 1.95 * s;
      var mid = [top[0] + cx * L * 0.55, top[1] + 0.35 * s, top[2] + cz * L * 0.55], tip = [top[0] + cx * L, top[1] - 0.8 * s, top[2] + cz * L];
      var px = -cz * 0.42 * s, pz = cx * 0.42 * s;
      var col = j % 2 ? C.palm : C.leafB;
      B.tri(top, [mid[0] + px, mid[1], mid[2] + pz], mid, col, M_NONE);
      B.tri(top, mid, [mid[0] - px, mid[1], mid[2] - pz], col, M_NONE);
      B.tri([mid[0] + px, mid[1], mid[2] + pz], tip, mid, mixC(col, C.leafC, 0.25), M_NONE);
      B.tri(mid, tip, [mid[0] - px, mid[1], mid[2] - pz], mixC(col, C.leafC, 0.25), M_NONE);
    }
    B.swK = 0;
    var fc = frame(top[0], top[1], top[2], 0);
    ball(B, fc, 0.18, -0.25, 0.1, 0.16, 0.16, 0.16, C.woodDk, M_NONE, 0, 0, 0, true);
    ball(B, fc, -0.15, -0.28, 0.12, 0.15, 0.15, 0.15, C.woodDk, M_NONE, 0, 0, 0, true);
    coll(x, z, 0.35); TREES.push([x, z, 0.8, 2]);
  }
  function bush(B, x, z, gy, s, seed, col) {
    var f = frame(x, gy, z, seed);
    B.swK = 0.2; B.swB = gy;
    ball(B, f, 0, 0.35 * s, 0, 0.62 * s, 0.48 * s, 0.62 * s, col || C.leafB, M_NONE, 0, 0.45, seed, true);
    if (hash2(seed, 4.4) > 0.55) { for (var k = 0; k < 4; k++) { var a = k * 1.7 + seed; ball(B, f, Math.cos(a) * 0.45 * s, 0.6 * s, Math.sin(a) * 0.45 * s, 0.1, 0.1, 0.1, [C.pink, C.white, C.janur, C.purple][k], M_NONE, 0, 0, 0, true); } }
    B.swK = 0;
  }
  function rock(B, x, z, gy, s, seed) {
    var f = frame(x, gy, z, seed);
    ball(B, f, 0, 0.12 * s, 0, 0.7 * s, 0.5 * s, 0.6 * s, mixC(C.rock, C.stoneDk, hash2(seed, 1)), M_ROCK, 0, 0.6, seed, true);
    if (s > 0.9) { coll(x, z, 0.55 * s); }
  }
  function flowerPatch(B, x, z, seed) {
    var cols = [C.pink, C.white, C.janur, hex("#ff9a3c"), C.purple, hex("#8fd3ff")];
    B.swK = 0.6; B.swB = 0;
    for (var i = 0; i < 7; i++) {
      var a = hash2(seed, i) * TAU, r = hash2(i, seed) * 1.2, fx = x + Math.cos(a) * r, fz = z + Math.sin(a) * r, gy = height(fx, fz);
      if (gy < 0.4) { continue; }
      B.swB = gy;
      var c = cols[Math.floor(hash2(seed + i, 5) * cols.length)], s = 0.13;
      B.tri([fx, gy, fz], [fx + 0.03, gy + 0.32, fz], [fx - 0.03, gy + 0.32, fz], C.leafB, M_NONE);
      B.tri([fx - s, gy + 0.36, fz], [fx + s, gy + 0.36, fz - s * 0.6], [fx, gy + 0.36, fz + s], c, M_NONE);
      B.tri([fx - s * 0.7, gy + 0.37, fz - s * 0.6], [fx + s * 0.8, gy + 0.37, fz + s * 0.3], [fx, gy + 0.42, fz], c, M_NONE);
    }
    B.swK = 0;
  }

  /* ---------- terrain ---------- */
  var PLAZA = { x: 0, z: 0.4, r: 8.4 };
  function terrainColor(cx, cz, h, ny) {
    var d = coastD(cx, cz);
    if (h < 0.06) { return [mixC(C.sandWet, hex("#b9a477"), clamp(-h / 2.5, 0, 1)), M_SAND]; }
    if (ny < 0.74 && h > 0.9) { return [mixC(C.rock, C.stoneDk, vnoise(cx * 0.5, cz * 0.5)), M_ROCK]; }
    var dp = Math.hypot(cx - PLAZA.x, cz - PLAZA.z);
    if (dp < PLAZA.r) { var ring = (dp > PLAZA.r - 0.8) ? 0.86 : 1; return [mixC(C.plaza, C.stoneDk, (1 - ring) * 2 + vnoise(cx * 1.2, cz * 1.2) * 0.15), M_STONE]; }
    var rd = roadDist(cx, cz);
    if (rd < 1.05 && h > 0.25) { return [mixC(C.path, hex("#c8ab78"), vnoise(cx * 0.9, cz * 0.9) * 0.6), M_DIRT]; }
    if (h < 0.55 || d < 4.2) { return [mixC(C.sand, C.sandWet, clamp((0.55 - h) * 1.6, 0, 1) * 0.7), M_SAND]; }
    var g = vnoise(cx * 0.16, cz * 0.16), g2 = vnoise(cx * 0.6 + 9, cz * 0.6);
    var col = mixC(C.grassA, C.grassB, clamp(g * 1.1 + g2 * 0.25 - 0.2, 0, 1));
    if (rd < 1.6) { col = mixC(col, C.path, (1.6 - rd) / 0.55 * 0.45); }
    if (h > 3.8) { col = mixC(col, hex("#a9cf6a"), clamp((h - 3.8) / 2, 0, 0.4)); }
    if (d < 5.4) { col = mixC(col, C.sand, (5.4 - d) / 1.2 * 0.6); }
    return [col, M_GRASS];
  }
  function buildTerrain(B) {
    var N = 86, S = 1.2, H0 = -N * S / 2, W = N + 1;
    var hs = new Float32Array(W * W);
    for (var j = 0; j < W; j++) { for (var i = 0; i < W; i++) { hs[j * W + i] = height(H0 + i * S, H0 + j * S); } }
    var P = function (i, j) { return [H0 + i * S, hs[j * W + i], H0 + j * S]; };
    for (var jj = 0; jj < N; jj++) {
      for (var ii = 0; ii < N; ii++) {
        var a = P(ii, jj), b = P(ii + 1, jj), c = P(ii, jj + 1), d = P(ii + 1, jj + 1);
        if (a[1] < -2.3 && b[1] < -2.3 && c[1] < -2.3 && d[1] < -2.3) { continue; }
        var tris = (ii + jj) % 2 ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]];
        for (var t = 0; t < 2; t++) {
          var tr = tris[t];
          var cx = (tr[0][0] + tr[1][0] + tr[2][0]) / 3, cz = (tr[0][2] + tr[1][2] + tr[2][2]) / 3, ch = (tr[0][1] + tr[1][1] + tr[2][1]) / 3;
          var ux = tr[1][0] - tr[0][0], uy = tr[1][1] - tr[0][1], uz = tr[1][2] - tr[0][2], vx = tr[2][0] - tr[0][0], vy = tr[2][1] - tr[0][1], vz = tr[2][2] - tr[0][2];
          var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
          var tc = terrainColor(cx, cz, ch, Math.abs(ny / nl));
          B.tri(tr[0], tr[1], tr[2], tc[0], tc[1]);
        }
      }
    }
  }

  /* ================= GAME: world assembly, actors, camera, loop ================= */
  var G = {
    ready: false, started: false, t: 0, last: 0, raf: 0, frameN: 0, paused: false,
    tod: 9, todSpeed: 1 / 110, env: null, lastL: [0, 1, 0],
    player: null, cam: { yaw: 0.42, pitch: 0.84, dist: 17, tx: 0, ty: 1.2, tz: 37.6, mode: "title", tw: null, zoomT: 17 },
    keys: {}, joy: { x: 0, y: 0, on: false }, inside: null, near: null, autoEnter: null,
    locs: [], npcs: [], villagers: [], harta: [], lanterns: [], props: {}, markers: [], perf: { acc: 0, n: 0, scale: 1 },
    dirty: true, stepT: 0
  };
  var PIER = { x0: -1.5, x1: 1.5, z0: 28.2, z1: 40.4, y: 0.62 };
  function onPier(x, z) { return x > PIER.x0 && x < PIER.x1 && z > PIER.z0 && z < PIER.z1; }
  function groundY(x, z) { if (onPier(x, z)) { return PIER.y; } return Math.max(height(x, z), 0); }
  function walkable(x, z) {
    if (onPier(x, z)) { return true; }
    if (z > 27.6 && Math.abs(x) < 1.6 && z < 28.8) { return true; }
    if (height(x, z) < 0.16) { return false; }
    for (var i = 0; i < COLL.length; i++) { var c = COLL[i], dx = x - c.x, dz = z - c.z, r = c.r + 0.32; if (dx * dx + dz * dz < r * r) { return false; } }
    return true;
  }

  /* ---------- which locations exist (couple settings + empty-data hiding) ---------- */
  var LOC_ORDER = ["hero", "prasasti", "couple", "kisah", "countdown", "events", "rundown", "venue", "hotel", "dresscode", "gallery", "video", "misi", "harta", "rsvp", "gifts", "wishes", "closing"];
  function aliveLocs() { return LOC_ORDER.filter(function (id) { return isAlive(id); }); }
  function domOrder() {
    return qsa("body > [data-section]").map(function (s) { return s.getAttribute("data-section"); }).filter(function (id) { return id !== "cover" && WL[id] && isAlive(id); });
  }

  function buildStatic(alive) {
    PADS.length = 0; COLL.length = 0; TREES.length = 0;
    var has = function (id) { return alive.indexOf(id) >= 0; };
    addPad(0, 0.3, 7.2, 0.55);
    addPad(-17, 2.5, 4.3); addPad(17, 2.5, 4.3);
    addPad(-12, -11, 3.7); addPad(12, -11, 3.6); addPad(0, -21, 3.1, 4.4); addPad(21, -7, 4.4); addPad(-11, 11.5, 3.1);
    addPad(-21.5, -7.5, 3.9); addPad(8.5, 8, 3.3); addPad(-7.5, 7.5, 2.1); addPad(0, 14.5, 2.4); addPad(-8, 21.5, 2.3); addPad(10, 19, 3.2, 0.6);
    addPad(-15, 16, 2.4); addPad(20.5, 12.5, 4.2); addPad(-27, -3, 2.7, 3.2); addPad(19, -16, 2.2, 1.4);
    var B = new Builder(97);
    buildTerrain(B);
    var gy = function (x, z) { return height(x, z); };
    pier(B, gy(0, 27.4));
    if (has("prasasti")) { monolith(B, -8, 21.5, gy(-8, 21.5)); } else { rock(B, -8, 21.5, gy(-8, 21.5), 1.4, 3); }
    if (has("couple")) {
      house(B, -17, 2.5, gy(-17, 2.5), { w: 6, d: 5, h: 3.3, rh: 2.4, wall: C.wallB, roof: C.roof, accent: C.blue, flower: C.janur });
      house(B, 17, 2.5, gy(17, 2.5), { w: 6, d: 5, h: 3.3, rh: 2.4, wall: C.wallP, roof: C.roof, accent: C.pink, flower: C.pink });
    }
    if (has("kisah")) { trophyHall(B, -12, -11, gy(-12, -11)); }
    if (has("countdown")) { campfire(B, 10, 19, gy(10, 19)); }
    pendopo(B, 0, 0, gy(0, 0.3));
    if (has("rundown")) { gapura(B, 0, 14.5, gy(0, 14.5)); }
    tower(B, 0, -21, gy(0, -21));
    if (has("hotel")) { inn(B, 21, -7, gy(21, -7)); }
    if (has("dresscode")) { boutique(B, -11, 11.5, gy(-11, 11.5)); }
    if (has("gallery")) { studio(B, 12, -11, gy(12, -11)); }
    if (has("video")) { cinema(B, -21.5, -7.5, gy(-21.5, -7.5)); }
    if (has("misi")) { questBoard(B, -7.5, 7.5, gy(-7.5, 7.5)); }
    if (has("harta")) { shipwreck(B, -20, 19.5, Math.max(gy(-20, 19.5), 0)); }
    if (has("rsvp")) { guildHall(B, 8.5, 8, gy(8.5, 8)); }
    if (has("gifts")) { well(B, -15, 16, gy(-15, 16)); }
    if (has("wishes")) { arbor(B, 20.5, 12.5, gy(20.5, 12.5)); }
    bench(B, -27, -3, gy(-27, -3), -Math.PI / 2);
    roundTree(B, -27.6, -5.6, gy(-27.6, -5.6), 1.45, 11.3);
    windmillBase(B, 19, -16, gy(19, -16));
    [[1.9, 25.4], [-1.9, 19], [1.9, 11.2], [-7.6, 3.2], [7.6, 3.2], [-7.6, -3.6], [7.6, -3.6], [2.2, -9], [-2.2, -15], [-10.4, 6.6], [10.4, 6.6]].forEach(function (p) { lamp(B, p[0], p[1], gy(p[0], p[1])); coll(p[0], p[1], 0.3); });
    bench(B, -4.2, 8.6, gy(-4.2, 8.6), Math.PI); bench(B, 4.2, 8.6, gy(4.2, 8.6), Math.PI);
    placeVegetation(B, alive);
    return B.data();
  }
  function placeVegetation(B, alive) {
    var rnd = new Builder(4242);
    var doors = [];
    alive.forEach(function (id) { var L = WL[id]; (L.doors || [{ x: L.door[0], z: L.door[1] }]).forEach(function (d) { doors.push(d); }); });
    function free(x, z, r) {
      if (roadDist(x, z) < 2.0 + r) { return false; }
      if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r + 0.8 + r) { return false; }
      if (Math.abs(x) < 4.5 && z > 24) { return false; }
      for (var i = 0; i < COLL.length; i++) { var c = COLL[i]; if (Math.hypot(x - c.x, z - c.z) < c.r + r + 0.5) { return false; } }
      for (var k = 0; k < doors.length; k++) { if (Math.hypot(x - doors[k].x, z - doors[k].z) < 4.4 + r) { return false; } }
      return true;
    }
    var n = 0, tries = 0;
    while (n < 28 && tries < 600) {
      tries++;
      var a = rnd.rand() * TAU, R0 = coastR(a) - (2.4 + rnd.rand() * 2.8), x = Math.cos(a) * R0, z = Math.sin(a) * R0, h = height(x, z);
      if (h < 0.25 || h > 1.4 || !free(x, z, 0.7)) { continue; }
      palmTree(B, x, z, h, 0.85 + rnd.rand() * 0.35, n * 3.7 + 1); n++;
    }
    n = 0; tries = 0;
    while (n < 54 && tries < 2400) {
      tries++;
      var x2 = (rnd.rand() - 0.5) * 62, z2 = (rnd.rand() - 0.5) * 62, d2 = coastD(x2, z2), h2 = height(x2, z2);
      if (d2 < 6.5 || h2 < 0.75 || h2 > 5.2) { continue; }
      var forest = (z2 < -12 && Math.abs(x2) > 5) || (x2 > 23 && z2 < 8) || (x2 < -22 && z2 > 4 && z2 < 14) || (z2 > 4 && z2 < 12 && Math.abs(x2) > 12 && Math.abs(x2) < 16);
      if (!forest && rnd.rand() > 0.3) { continue; }
      if (!free(x2, z2, 1.1)) { continue; }
      roundTree(B, x2, z2, h2, 0.8 + rnd.rand() * 0.5, n * 1.9 + 5); n++;
    }
    n = 0; tries = 0;
    while (n < 16 && tries < 800) {
      tries++;
      var a3 = rnd.rand() * TAU, r3 = 5.5 + rnd.rand() * 6, x3 = Math.cos(a3) * r3, z3 = -21 + Math.sin(a3) * r3 * 0.8, h3 = height(x3, z3);
      if (h3 < 1.2 || !free(x3, z3, 0.9)) { continue; }
      pineTree(B, x3, z3, h3, 0.9 + rnd.rand() * 0.4, n * 2.3 + 2); n++;
    }
    n = 0; tries = 0;
    while (n < 44 && tries < 1400) {
      tries++;
      var x4 = (rnd.rand() - 0.5) * 60, z4 = (rnd.rand() - 0.5) * 60, h4 = height(x4, z4);
      if (coastD(x4, z4) < 5 || h4 < 0.6 || roadDist(x4, z4) < 1.3 || Math.hypot(x4 - PLAZA.x, z4 - PLAZA.z) < PLAZA.r + 0.6) { continue; }
      var ok = true;
      for (var i = 0; i < COLL.length; i++) { if (Math.hypot(x4 - COLL[i].x, z4 - COLL[i].z) < COLL[i].r + 0.3) { ok = false; break; } }
      for (var k = 0; k < doors.length && ok; k++) { if (Math.hypot(x4 - doors[k].x, z4 - doors[k].z) < 2.4) { ok = false; } }
      if (!ok) { continue; }
      if (n % 3 === 0) { flowerPatch(B, x4, z4, n + 0.5); } else { bush(B, x4, z4, h4, 0.7 + rnd.rand() * 0.6, n * 1.3, n % 4 === 1 ? C.leafD : null); }
      n++;
    }
    n = 0; tries = 0;
    while (n < 22 && tries < 900) {
      tries++;
      var a5 = rnd.rand() * TAU, R5 = coastR(a5) - (0.2 + rnd.rand() * 2.4), x5 = Math.cos(a5) * R5, z5 = Math.sin(a5) * R5;
      if (Math.abs(x5) < 4 && z5 > 24) { continue; }
      var h5 = height(x5, z5);
      if (h5 < -1.2) { continue; }
      rock(B, x5, z5, h5, 0.6 + rnd.rand() * 1.1, n * 2.1 + 9); n++;
    }
  }

  /* ---------- small meshes for actors & props ---------- */
  var PRIM = {};
  var WHITE = [1, 1, 1];
  function buildPrims(r) {
    var gl = r.gl, f0 = frame(0, 0, 0, 0), b;
    b = new Builder(3); box(b, f0, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, WHITE, M_NONE, 0, true); PRIM.cube = glMesh(gl, b.data());
    b = new Builder(5); ball(b, f0, 0, 0, 0, 1, 1, 1, WHITE, M_NONE); PRIM.sphere = glMesh(gl, b.data());
    b = new Builder(6); cyl(b, f0, 0, 0, 1, 0, 0, 1, 10, WHITE, M_NONE); PRIM.cone = glMesh(gl, b.data());
    b = new Builder(7); cyl(b, f0, 0, 0, 1, 1, 0, 1, 10, WHITE, M_NONE, 0, true); PRIM.cyl = glMesh(gl, b.data());
    b = new Builder(8);
    cyl(b, f0, 0, 0, 0.12, 0.12, -0.2, 0.2, 6, C.woodDk, M_WOOD, 0, true);
    for (var i = 0; i < 4; i++) { var fr = frame(0, 0, 0, 0, 0, i * Math.PI / 2); box(b, fr, -0.18, 0.2, -0.04, 0.18, 3.4, 0.04, C.woodLt, M_WOOD); b.quad(fr(0.18, 0.7, 0.02), fr(1.0, 0.8, 0.02), fr(1.0, 3.3, 0.02), fr(0.18, 3.3, 0.02), C.sail, M_NONE); }
    PRIM.blades = glMesh(gl, b.data());
    b = new Builder(9);
    var fb = frame(0, 0, 0, 0);
    for (var k = 0; k < 6; k++) {
      var t0 = k / 6, t1 = (k + 1) / 6, w0 = 0.95 * Math.sin(Math.PI * (0.1 + t0 * 0.85)), w1 = 0.95 * Math.sin(Math.PI * (0.1 + t1 * 0.85)), z0 = -2 + t0 * 4, z1 = -2 + t1 * 4;
      b.quad(fb(-w0, 0.55, z0), fb(-w1, 0.55, z1), fb(-w1 * 0.4, -0.35, z1), fb(-w0 * 0.4, -0.35, z0), C.wood, M_WOOD);
      b.quad(fb(w0, 0.55, z0), fb(w1, 0.55, z1), fb(w1 * 0.4, -0.35, z1), fb(w0 * 0.4, -0.35, z0), C.wood, M_WOOD);
      b.quad(fb(-w0 * 0.4, -0.35, z0), fb(-w1 * 0.4, -0.35, z1), fb(w1 * 0.4, -0.35, z1), fb(w0 * 0.4, -0.35, z0), C.woodDk, M_WOOD);
    }
    box(b, fb, -0.85, 0.3, -1.5, 0.85, 0.42, 1.5, C.woodLt, M_WOOD);
    PRIM.boat = glMesh(gl, b.data());
    b = new Builder(10);
    cyl(b, fb, 0, 0, 0.06, 0.05, 0.4, 4.2, 5, C.woodDk, M_WOOD);
    b.tri(fb(0.05, 4.0, 0), fb(0.05, 1.0, 0), fb(1.9, 1.1, 0), C.sail, M_NONE);
    b.tri(fb(-0.05, 3.6, 0), fb(-0.05, 1.1, 0), fb(-1.3, 1.1, 0), hex("#ffd6de"), M_NONE);
    PRIM.sail = glMesh(gl, b.data());
    b = new Builder(11);
    var gem = [[0, 1, 0], [0.62, 0, 0], [0, 0, 0.62], [-0.62, 0, 0], [0, 0, -0.62], [0, -1, 0]];
    [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]].forEach(function (t, i) { b.tri(gem[t[0]], gem[t[1]], gem[t[2]], i % 2 ? C.gold : hex("#ffe38a"), M_NONE, 2); });
    PRIM.gem = glMesh(gl, b.data());
    b = new Builder(12);
    for (var q = 0; q < 16; q++) { var a0 = q / 16 * TAU, a1 = (q + 1) / 16 * TAU; b.quad([Math.cos(a0) * 1.9, -0.06, Math.sin(a0) * 1.9], [Math.cos(a1) * 1.9, -0.06, Math.sin(a1) * 1.9], [Math.cos(a1) * 1.9, 0.06, Math.sin(a1) * 1.9], [Math.cos(a0) * 1.9, 0.06, Math.sin(a0) * 1.9], C.cyan, M_NONE, 2); }
    PRIM.ring = glMesh(gl, b.data());
    b = new Builder(13);
    ball(b, fb, 0, 0.3, 0, 2.3, 1.5, 1.8, WHITE, M_NONE, 0, 0.12, 1); ball(b, fb, 2.1, -0.1, 0.3, 1.6, 1.1, 1.4, WHITE, M_NONE, 0, 0.12, 2); ball(b, fb, -2.0, -0.15, -0.2, 1.5, 1.0, 1.3, WHITE, M_NONE, 0, 0.12, 3); ball(b, fb, 0.6, -0.35, 1.1, 1.3, 0.8, 1.1, WHITE, M_NONE, 0, 0.12, 4);
    PRIM.cloud = glMesh(gl, b.data());
    b = new Builder(14);
    b.tri([0, 0, 0.25], [0, 0, -0.25], [-0.9, 0.1, 0.05], hex("#f4f4f8"), M_NONE); b.tri([0, 0, 0.25], [0, 0, -0.25], [0.9, 0.1, 0.05], hex("#f4f4f8"), M_NONE);
    PRIM.wingL = glMesh(gl, (function () { var w = new Builder(15); w.tri([0, 0, 0.22], [0, 0, -0.22], [-0.95, 0, 0.02], hex("#f4f4f8"), M_NONE); return w.data(); })());
    PRIM.wingR = glMesh(gl, (function () { var w = new Builder(16); w.tri([0, 0, 0.22], [0, 0, -0.22], [0.95, 0, 0.02], hex("#f4f4f8"), M_NONE); return w.data(); })());
    b = new Builder(17);
    cyl(b, fb, 0, 0, 0.035, 0.035, 0, 1.1, 4, C.dark, M_NONE);
    box(b, fb, -0.16, 1.1, -0.16, 0.16, 1.45, 0.16, hex("#ffcf7a"), M_NONE, 2);
    hip(b, fb, 0.22, 0.22, 1.45, 1.62, 0, 0, C.dark, M_NONE);
    PRIM.lantern = glMesh(gl, b.data());
    b = new Builder(18);
    cyl(b, fb, 0, 0, 0.5, 0, 0, 1, 7, hex("#ff8a3d"), M_NONE, 2); PRIM.flame = glMesh(gl, b.data());
    b = new Builder(19);
    cyl(b, fb, 0, 0, 0.3, 0, 0, 1, 6, hex("#ffe08a"), M_NONE, 2); PRIM.flame2 = glMesh(gl, b.data());
  }

  /* ---------- characters ---------- */
  var SKIN = hex("#f5cda5"), HAIR = hex("#3b2a2a");
  function makeChar(o) {
    return { x: o.x, z: o.z, y: o.y || 0, rot: o.rot || 0, phase: Math.random() * 6, spd: 0, style: o.style || "short", outfit: o.outfit || hex("#2bb3c0"), outfit2: o.outfit2 || null, pants: o.pants || hex("#3a3355"), skin: o.skin || SKIN, hair: o.hair || HAIR, wave: 0, s: o.s || 1, line: o.line || "", name: o.name || "", id: o.id || mkId("npc"), fixedY: o.fixedY };
  }
  var TMP = M4.create(), BASE = M4.create();
  function part(base, mesh, tint, tx, ty, tz, sx, sy, sz, rx, rz, pivotY) {
    M4.copy(TMP, base); M4.translate(TMP, tx, ty, tz);
    if (rx) { M4.rotX(TMP, rx); }
    if (rz) { M4.rotZ(TMP, rz); }
    if (pivotY) { M4.translate(TMP, 0, pivotY, 0); }
    M4.scale(TMP, sx, sy, sz);
    drawMesh(R, mesh, TMP, tint);
  }
  function drawChar(ch) {
    M4.ident(BASE); M4.translate(BASE, ch.x, ch.y, ch.z); M4.rotY(BASE, ch.rot);
    if (ch.s !== 1) { M4.scale(BASE, ch.s, ch.s, ch.s); }
    var k = Math.min(1, ch.spd / 4.5), sw = Math.sin(ch.phase) * k;
    var bob = Math.abs(Math.cos(ch.phase)) * 0.06 * k + Math.sin(G.t * 2.2 + ch.phase) * 0.012;
    if (ch.dress) {
      part(BASE, PRIM.cone, ch.outfit2 || ch.outfit, 0, 0.02 + bob, 0, 0.44, 1.0, 0.44, 0, 0, 0);
    } else {
      part(BASE, PRIM.cube, ch.pants, -0.12, 0.62 + bob, 0, 0.17, 0.56, 0.2, sw * 0.7, 0, -0.28);
      part(BASE, PRIM.cube, ch.pants, 0.12, 0.62 + bob, 0, 0.17, 0.56, 0.2, -sw * 0.7, 0, -0.28);
    }
    part(BASE, PRIM.cube, ch.outfit, 0, 0.92 + bob, 0, 0.5, 0.58, 0.34, 0, 0, 0);
    if (ch.sash) { part(BASE, PRIM.cube, ch.sash, 0, 0.67 + bob, 0, 0.53, 0.12, 0.37, 0, 0, 0); }
    part(BASE, PRIM.cube, ch.outfit, -0.33, 1.15 + bob, 0, 0.14, 0.46, 0.15, -sw * 0.55, -0.07, -0.22);
    if (ch.wave > 0) { part(BASE, PRIM.cube, ch.outfit, 0.33, 1.15 + bob, 0, 0.14, 0.46, 0.15, 0, 2.55 + Math.sin(G.t * 9) * 0.35, -0.22); }
    else { part(BASE, PRIM.cube, ch.outfit, 0.33, 1.15 + bob, 0, 0.14, 0.46, 0.15, sw * 0.55, 0.07, -0.22); }
    part(BASE, PRIM.sphere, ch.skin, 0, 1.58 + bob, 0, 0.4, 0.38, 0.38, 0, 0, 0);
    if (ch.style === "hijab") {
      var hj = ch.outfit2 || mixC(ch.outfit, WHITE, 0.4);
      part(BASE, PRIM.cone, hj, 0, 0.98 + bob, -0.02, 0.42, 0.62, 0.36, 0, 0, 0);
      part(BASE, PRIM.sphere, hj, 0, 1.61 + bob, -0.05, 0.45, 0.45, 0.44, 0, 0, 0);
      part(BASE, PRIM.sphere, ch.skin, 0, 1.56 + bob, 0.1, 0.3, 0.31, 0.3, 0, 0, 0);
    } else {
      part(BASE, PRIM.sphere, ch.hair, 0, 1.76 + bob, -0.09, 0.43, 0.31, 0.41, 0, 0, 0);
      if (ch.style !== "hat" && ch.style !== "peci") { part(BASE, PRIM.sphere, ch.hair, 0, 1.87 + bob, 0.17, 0.35, 0.1, 0.14, 0, 0, 0); }
      if (ch.style === "long" || ch.style === "veil") { part(BASE, PRIM.cube, ch.hair, 0, 1.38 + bob, -0.24, 0.66, 0.66, 0.16, 0, 0, 0); }
      if (ch.style === "peci") { part(BASE, PRIM.cyl, hex("#1f1b2e"), 0, 1.8 + bob, -0.02, 0.36, 0.26, 0.36, -0.1, 0, 0); }
      if (ch.style === "hat") { part(BASE, PRIM.cone, hex("#d9b56b"), 0, 1.8 + bob, 0, 0.8, 0.42, 0.8, 0, 0, 0); }
      if (ch.style === "veil") {
        part(BASE, PRIM.cone, hex("#fffaf4"), 0, 0.46 + bob, -0.18, 0.5, 1.46, 0.32, 0.12, 0, 0);
        part(BASE, PRIM.sphere, C.gold, 0, 1.98 + bob, 0, 0.22, 0.08, 0.22, 0, 0, 0);
      }
    }
    part(BASE, PRIM.cube, C.dark, -0.13, 1.6 + bob, 0.37, 0.07, 0.11, 0.05, 0, 0, 0);
    part(BASE, PRIM.cube, C.dark, 0.13, 1.6 + bob, 0.37, 0.07, 0.11, 0.05, 0, 0, 0);
    part(BASE, PRIM.sphere, C.pink, -0.22, 1.5 + bob, 0.315, 0.065, 0.04, 0.035, 0, 0, 0);
    part(BASE, PRIM.sphere, C.pink, 0.22, 1.5 + bob, 0.315, 0.065, 0.04, 0.035, 0, 0, 0);
  }
  function drawCat(c) {
    M4.ident(BASE); M4.translate(BASE, c.x, c.y, c.z); M4.rotY(BASE, c.rot);
    var br = 1 + Math.sin(G.t * 1.8) * 0.04, col = hex("#f3a24b");
    part(BASE, PRIM.sphere, col, 0, 0.2, 0, 0.26, 0.17 * br, 0.4, 0, 0, 0);
    part(BASE, PRIM.sphere, col, 0, 0.3, 0.36, 0.2, 0.17, 0.18, 0, 0, 0);
    part(BASE, PRIM.cone, col, -0.1, 0.42, 0.38, 0.06, 0.12, 0.05, 0, 0, 0);
    part(BASE, PRIM.cone, col, 0.1, 0.42, 0.38, 0.06, 0.12, 0.05, 0, 0, 0);
    part(BASE, PRIM.cube, col, 0.12, 0.22, -0.46, 0.06, 0.06, 0.4, 0, 0.6 + Math.sin(G.t * 1.2) * 0.3, 0);
  }

  /* ---------- time of day ---------- */
  var TODK = [
    { t: 0, top: "#0b1236", hor: "#23306a", sun: [0.4, 0.48, 0.86], si: 0.46, as: [0.3, 0.34, 0.58], ag: [0.12, 0.12, 0.22], night: 1, sh: "#1f6b86", dp: "#0d2f52" },
    { t: 4.9, top: "#0f1740", hor: "#2a3574", sun: [0.4, 0.48, 0.86], si: 0.46, as: [0.3, 0.34, 0.58], ag: [0.12, 0.12, 0.22], night: 1, sh: "#1f6b86", dp: "#0d2f52" },
    { t: 6.1, top: "#4a5aa0", hor: "#ffb38a", sun: [1, 0.66, 0.48], si: 0.74, as: [0.52, 0.48, 0.6], ag: [0.3, 0.24, 0.26], night: 0.28, sh: "#57c7c9", dp: "#1f6d9e" },
    { t: 7.6, top: "#5ab0f5", hor: "#c9ecff", sun: [1, 0.9, 0.76], si: 1.0, as: [0.56, 0.64, 0.74], ag: [0.36, 0.32, 0.26], night: 0, sh: "#5ee0d6", dp: "#1c86b8" },
    { t: 12.5, top: "#3e9ff0", hor: "#d2f0ff", sun: [1, 0.97, 0.9], si: 1.08, as: [0.6, 0.68, 0.78], ag: [0.38, 0.34, 0.28], night: 0, sh: "#62e6da", dp: "#1a8cc0" },
    { t: 16.4, top: "#4a98e6", hor: "#ffe3b8", sun: [1, 0.86, 0.66], si: 1.0, as: [0.58, 0.6, 0.68], ag: [0.4, 0.32, 0.26], night: 0, sh: "#5fdcd0", dp: "#1b80b0" },
    { t: 17.9, top: "#3c4c9c", hor: "#ff9d72", sun: [1, 0.55, 0.38], si: 0.86, as: [0.52, 0.42, 0.52], ag: [0.36, 0.24, 0.26], night: 0.28, sh: "#4fb8c4", dp: "#1d5c93" },
    { t: 19.3, top: "#1a2458", hor: "#4a4a92", sun: [0.5, 0.52, 0.86], si: 0.5, as: [0.32, 0.34, 0.58], ag: [0.14, 0.13, 0.24], night: 0.9, sh: "#2b7f98", dp: "#10365c" },
    { t: 24, top: "#0b1236", hor: "#23306a", sun: [0.4, 0.48, 0.86], si: 0.46, as: [0.3, 0.34, 0.58], ag: [0.12, 0.12, 0.22], night: 1, sh: "#1f6b86", dp: "#0d2f52" }
  ];
  TODK.forEach(function (k) { k.top = hex(k.top); k.hor = hex(k.hor); k.sh = hex(k.sh); k.dp = hex(k.dp); });
  function nrm3(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function envAt(tod) {
    tod = ((tod % 24) + 24) % 24;
    var i = 0; while (i < TODK.length - 2 && TODK[i + 1].t <= tod) { i++; }
    var a = TODK[i], b = TODK[i + 1], t = smooth(0, 1, (tod - a.t) / (b.t - a.t));
    var L3 = function (p, q) { return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t)]; };
    var th = (tod - 6) / 12 * Math.PI;
    var sunD = nrm3([Math.cos(th), Math.sin(th), 0.42]), moonD = nrm3([-Math.cos(th), -Math.sin(th), 0.3]);
    var w = smooth(-0.12, 0.14, sunD[1]);
    var L = nrm3([lerp(moonD[0], sunD[0], w), lerp(moonD[1], sunD[1], w), lerp(moonD[2], sunD[2], w)]);
    L = nrm3([L[0], Math.max(L[1], 0.34), L[2]]);
    var si = lerp(a.si, b.si, t), sc = L3(a.sun, b.sun), top = L3(a.top, b.top), hor = L3(a.hor, b.hor);
    return { top: top, hor: hor, fog: mixC(hor, top, 0.12), sunDir: L, sunDisk: sunD, moonDir: moonD, sunCol: [sc[0] * si, sc[1] * si, sc[2] * si], ambSky: L3(a.as, b.as), ambGnd: L3(a.ag, b.ag), night: lerp(a.night, b.night, t), fogDen: 0.0079, wind: 1, shallow: L3(a.sh, b.sh), deep: L3(a.dp, b.dp) };
  }
  function lightChanged(L) { var o = G.lastL, d = o[0] * L[0] + o[1] * L[1] + o[2] * L[2]; if (d < 0.99995) { G.lastL = L.slice(); return true; } return false; }
  var LV = M4.create(), LP = M4.create();
  function updateLightVP(L) {
    M4.lookAt(LV, [L[0] * 80, L[1] * 80, L[2] * 80], [0, 0, 0], Math.abs(L[1]) > 0.98 ? [0, 0, 1] : [0, 1, 0]);
    M4.ortho(LP, -44, 44, -44, 44, 20, 170);
    M4.mul(R.lightVP, LP, LV);
    R.shadowDirty = true;
  }

  /* ---------- world init ---------- */
  var LAMPS = [];
  function initWorld(progress) {
    var alive = aliveLocs();
    var data = buildStatic(alive);
    progress(0.55);
    R.staticMesh = glMesh(R.gl, data);
    progress(0.7);
    makeHeightTexture(R, height, -72, 144, 160);
    makeWaterMesh(R, 96, 96);
    buildPrims(R);
    loadDetailTexture(R, DETAIL_TEX);
    progress(0.85);
    buildLocs();
    LAMPS.length = 0;
    [[1.9, 25.4], [-1.9, 19], [1.9, 11.2], [-7.6, 3.2], [7.6, 3.2], [-7.6, -3.6], [7.6, -3.6], [2.2, -9], [-2.2, -15], [-10.4, 6.6], [10.4, 6.6]].forEach(function (p) { LAMPS.push([p[0], height(p[0], p[1]) + 2.72, p[1]]); });
    [31.2, 35.6, 40].forEach(function (z) { LAMPS.push([1.35, PIER.y + 2.38, z]); });
    var dresC = firstOutfit();
    var st = save.style === "long" || save.style === "hijab" ? save.style : "short";
    G.player = makeChar({ x: 0, z: 37.6, y: PIER.y, rot: Math.PI, style: st, outfit: save.outfit ? hex(save.outfit) : dresC, pants: hex("#3a3355") });
    G.player.dress = false;
    var pz = height(0, 0.3) + 0.6;
    var gnpc = makeChar({ x: -0.75, z: -1.05, y: pz, rot: 0, style: "peci", outfit: hex("#f3ead6"), pants: hex("#2a2a38"), line: txt("couple-line-src"), name: GROOM });
    gnpc.sash = hex("#8a5a33");
    var bnpc = makeChar({ x: 0.75, z: -1.05, y: pz, rot: 0, style: "veil", outfit: hex("#fff7ee"), outfit2: hex("#f2dcc0"), line: txt("couple-line-src"), name: BRIDE });
    bnpc.dress = true;
    var fish = makeChar({ x: -0.8, z: 30.4, y: PIER.y, rot: Math.PI * 0.5, style: "hat", outfit: hex("#3f7fbf"), pants: hex("#5b4a3a"), line: txt("guide-line-src"), name: window.PULAU.translate("Pak Nelayan") });
    G.npcs = [gnpc, bnpc, fish];
    var vs = [
      { path: ringPath(7.4, 12), outfit: "#ff8a6b", style: "long", line: window.PULAU.translate("Pendoponya cantik sekali, ya! Aku sudah tidak sabar.") },
      { path: [[0, 21.2], [5, 21.5], [10, 21.4], [15.5, 17.4], [20.5, 15.4]], outfit: "#7bc96f", style: "short", line: window.PULAU.translate("Sudah mampir ke Balai Petualang? Jangan lupa isi formulir party-nya!") },
      { path: [[-6.8, 3.4], [-11.5, 5.4], [-16.6, 6.8], [-21.4, 2.6]], outfit: "#b48ce8", style: "hijab", line: window.PULAU.translate("Kabarnya ada harta karun tersembunyi di sekitar pulau ini…") }
    ];
    G.villagers = vs.map(function (v, i) {
      var c = makeChar({ x: v.path[0][0], z: v.path[0][1], y: 0, style: v.style, outfit: hex(v.outfit), line: v.line, name: window.PULAU.translate("Warga Pulau") });
      c.path = v.path; c.wi = 1; c.dir = 1; c.loop = i === 0; c.pause = 0;
      return c;
    });
    G.cat = { x: 11.2, z: 19.9, y: height(11.2, 19.9), rot: -2.2 };
    G.boats = [{ a: 0.3, r: 46, sp: 0.022, ph: 0 }, { a: 2.6, r: 52, sp: -0.018, ph: 2 }];
    G.dock = { x: 2.6, z: 39.2 };
    G.clouds = [];
    for (var i = 0; i < 7; i++) { G.clouds.push({ x: (Math.random() - 0.5) * 120, z: (Math.random() - 0.5) * 120, y: 22 + Math.random() * 8, s: 0.8 + Math.random() * 0.8, sp: 0.8 + Math.random() * 0.6 }); }
    G.birds = [];
    for (var j = 0; j < 5; j++) { G.birds.push({ off: j, ph: Math.random() * 6 }); }
    buildHarta();
    buildNavGrid();
    G.actors = [G.player].concat(G.npcs, G.villagers);
    progress(1);
  }
  function ringPath(r, n) { var p = []; for (var i = 0; i < n; i++) { var a = i / n * TAU; p.push([Math.cos(a) * r, 0.3 + Math.sin(a) * r]); } return p; }
  function firstOutfit() {
    var sw = qsa(".swatch").filter(function (b) { return b.style.display !== "none" && /^#?[0-9a-fA-F]{6}$/.test(clean(b.getAttribute("data-color"))); });
    return sw.length ? hex(clean(sw[0].getAttribute("data-color"))) : hex("#2bb3c0");
  }

  /* ---------- hidden treasures in the world ---------- */
  var HARTA_POS = [[2.8, -24.8], [19.6, -19.4], [16.4, 23.2], [-24.2, -12.6], [26.3, 3.6], [-12.8, 24.2]];
  function buildHarta() {
    G.harta = [];
    if (!isAlive("harta")) { return; }
    HARTA_POS.forEach(function (p, i) {
      var slot = $("hj-" + (i + 1));
      if (!slot || slot.style.display === "none") { return; }
      var x = p[0], z = p[1], tries = 0;
      while ((!walkable(x, z) || height(x, z) < 0.3) && tries < 30) { x *= 0.95; z *= 0.95; tries++; }
      G.harta.push({ i: i + 1, x: x, z: z, y: groundY(x, z) + 0.9, got: save.found.indexOf(i + 1) >= 0 });
    });
  }

  /* ---------- camera ---------- */
  function camDesired() {
    var c = G.cam, p = G.player, narrow = window.innerWidth < 700;
    if (c.mode === "title") { return { yaw: c.yaw, pitch: 0.6, dist: narrow ? 82 : 66, tx: 0, ty: 2, tz: 3 }; }
    if (c.mode === "page") { return { yaw: c.yaw, pitch: 0.5, dist: narrow ? 80 : 62, tx: 0, ty: 1, tz: 3 }; }
    return { yaw: c.yaw, pitch: c.pitch, dist: c.zoomT, tx: p.x, ty: p.y + 1.15, tz: p.z };
  }
  function camTween(dur) { var cu = G.cam.cur; if (!cu) { return; } G.cam.tw = { from: { yaw: cu.yaw, pitch: cu.pitch, dist: cu.dist, tx: cu.tx, ty: cu.ty, tz: cu.tz }, t: 0, dur: dur }; }
  var EYE = [0, 0, 0];
  function updateCamera(dt) {
    var c = G.cam;
    if (c.mode !== "follow") { c.yaw += dt * (c.mode === "title" ? 0.05 : 0.028); }
    if (G.keys.rotL) { c.yaw += dt * 1.7; } if (G.keys.rotR) { c.yaw -= dt * 1.7; }
    var d = camDesired();
    if (!c.cur) { c.cur = { yaw: d.yaw, pitch: d.pitch, dist: d.dist, tx: d.tx, ty: d.ty, tz: d.tz }; }
    var cu = c.cur;
    if (c.tw) {
      c.tw.t += dt;
      var k = clamp(c.tw.t / c.tw.dur, 0, 1); k = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      var f = c.tw.from;
      cu.yaw = f.yaw + angDiff(f.yaw, d.yaw) * k; cu.pitch = lerp(f.pitch, d.pitch, k); cu.dist = lerp(f.dist, d.dist, k);
      cu.tx = lerp(f.tx, d.tx, k); cu.ty = lerp(f.ty, d.ty, k); cu.tz = lerp(f.tz, d.tz, k);
      if (k >= 1) { c.tw = null; }
    } else {
      var s = 1 - Math.exp(-dt * 7);
      cu.yaw += angDiff(cu.yaw, d.yaw) * Math.min(1, dt * 16); cu.pitch = lerp(cu.pitch, d.pitch, s); cu.dist = lerp(cu.dist, d.dist, 1 - Math.exp(-dt * 5));
      cu.tx = lerp(cu.tx, d.tx, s); cu.ty = lerp(cu.ty, d.ty, s); cu.tz = lerp(cu.tz, d.tz, s);
    }
    var cp = Math.cos(cu.pitch);
    EYE[0] = cu.tx + Math.sin(cu.yaw) * cp * cu.dist; EYE[1] = cu.ty + Math.sin(cu.pitch) * cu.dist; EYE[2] = cu.tz + Math.cos(cu.yaw) * cp * cu.dist;
    var gh = groundY(EYE[0], EYE[2]) + 1.8; if (EYE[1] < gh) { EYE[1] = gh; }
    R.camPos = [EYE[0], EYE[1], EYE[2]];
    M4.lookAt(R.view, R.camPos, [cu.tx, cu.ty, cu.tz], [0, 1, 0]);
    R.fov = R.aspect < 0.8 ? 0.98 : 0.8;
    M4.persp(R.proj, R.fov, R.aspect, 0.35, 480);
    M4.mul(R.vp, R.proj, R.view); M4.invert(R.inv, R.vp);
    R.right = [R.view[0], R.view[4], R.view[8]]; R.up = [R.view[1], R.view[5], R.view[9]];
  }
  function project(x, y, z) {
    var m = R.vp, w = m[3] * x + m[7] * y + m[11] * z + m[15];
    var cx = m[0] * x + m[4] * y + m[8] * z + m[12], cy = m[1] * x + m[5] * y + m[9] * z + m[13];
    return { x: (cx / w * 0.5 + 0.5) * R.cssW, y: (1 - (cy / w * 0.5 + 0.5)) * R.cssH, w: w };
  }
  function unproject(nx, ny, nz) {
    var m = R.inv, x = m[0] * nx + m[4] * ny + m[8] * nz + m[12], y = m[1] * nx + m[5] * ny + m[9] * nz + m[13], z = m[2] * nx + m[6] * ny + m[10] * nz + m[14], w = m[3] * nx + m[7] * ny + m[11] * nz + m[15];
    return [x / w, y / w, z / w];
  }
  function raycastGround(sx, sy) {
    var nx = sx / R.cssW * 2 - 1, ny = 1 - sy / R.cssH * 2;
    var a = unproject(nx, ny, -1), b = unproject(nx, ny, 1);
    var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], len = Math.hypot(dx, dy, dz); dx /= len; dy /= len; dz /= len;
    var prev = 0;
    for (var t = 0.5; t < 260; t += 0.45) {
      var x = a[0] + dx * t, y = a[1] + dy * t, z = a[2] + dz * t;
      if (y <= groundY(x, z)) {
        var lo = prev, hi = t;
        for (var i = 0; i < 8; i++) { var m = (lo + hi) / 2; if (a[1] + dy * m <= groundY(a[0] + dx * m, a[2] + dz * m)) { hi = m; } else { lo = m; } }
        return [a[0] + dx * hi, a[2] + dz * hi];
      }
      prev = t;
    }
    return null;
  }

  /* ---------- player & actors ---------- */
  function updatePlayer(dt) {
    var p = G.player, k = G.keys, ix = 0, iy = 0;
    if (k.left) { ix -= 1; } if (k.right) { ix += 1; } if (k.up) { iy += 1; } if (k.down) { iy -= 1; }
    if (G.joy.on) { ix += G.joy.x; iy += G.joy.y; }
    var mag = Math.min(1, Math.hypot(ix, iy)), yaw = G.cam.cur ? G.cam.cur.yaw : 0;
    var dx = 0, dz = 0, want = 0;
    if (mag > 0.1) {
      var fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
      dx = fx * iy + rx * ix; dz = fz * iy + rz * ix; var l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      want = (k.run ? 8 : 5.6) * mag; p.target = null; p.path = null; G.autoEnter = null;
    } else if (p.target) {
      var tx = p.target[0] - p.x, tz = p.target[1] - p.z, dd = Math.hypot(tx, tz), last = !p.path || p.path.length <= 1;
      if (dd < (last ? 0.3 : 0.55)) { if (!last) { p.path.shift(); p.target = p.path[0]; } else { p.target = null; p.path = null; } }
      if (p.target) { tx = p.target[0] - p.x; tz = p.target[1] - p.z; dd = Math.hypot(tx, tz) || 1; dx = tx / dd; dz = tz / dd; want = last ? Math.min(6, dd * 3 + 1.4) : 6; }
    }
    var s = 1 - Math.exp(-dt * 9);
    p.vx = lerp(p.vx || 0, dx * want, s); p.vz = lerp(p.vz || 0, dz * want, s);
    var sp = Math.hypot(p.vx, p.vz);
    if (sp > 0.05) {
      var nx = p.x + p.vx * dt, nz = p.z + p.vz * dt, moved = true;
      if (walkable(nx, nz)) { p.x = nx; p.z = nz; }
      else if (walkable(nx, p.z)) { p.x = nx; p.vz *= 0.6; }
      else if (walkable(p.x, nz)) { p.z = nz; p.vx *= 0.6; }
      else {
        moved = false;
        var ang = Math.atan2(p.vx, p.vz), offs = [0.6, -0.6, 1.2, -1.2, 1.7, -1.7];
        for (var i = 0; i < offs.length; i++) { var a2 = ang + offs[i], x2 = p.x + Math.sin(a2) * sp * dt, z2 = p.z + Math.cos(a2) * sp * dt; if (walkable(x2, z2)) { p.x = x2; p.z = z2; moved = true; break; } }
      }
      if (!moved) { p.vx *= 0.3; p.vz *= 0.3; p.stuck = (p.stuck || 0) + dt; if (p.stuck > 0.7) { p.stuck = 0; if (p.path && p.path.length) { var end = p.path[p.path.length - 1]; var np = findPath(p.x, p.z, end[0], end[1]); if (np && np.length && !p.repathed) { p.repathed = true; p.path = np; p.target = np[0]; } else { p.target = null; p.path = null; p.repathed = false; } } else { p.target = null; } } } else { p.stuck = 0; }
      p.rot += angDiff(p.rot, Math.atan2(p.vx, p.vz)) * Math.min(1, dt * 12);
      G.stepT += dt * sp;
      if (G.stepT > 2.2) { G.stepT = 0; sfx("step"); }
    }
    p.spd = sp; p.phase += sp * dt * 2.1;
    p.y = lerp(p.y, groundY(p.x, p.z), Math.min(1, dt * 14));
  }
  function updateNPCs(dt) {
    var p = G.player;
    G.npcs.forEach(function (n) {
      var d = p ? Math.hypot(p.x - n.x, p.z - n.z) : 99;
      var want = d < 7 ? Math.atan2(p.x - n.x, p.z - n.z) : n.rot0 != null ? n.rot0 : (n.rot0 = n.rot);
      n.rot += angDiff(n.rot, want) * Math.min(1, dt * 3);
      n.wave = d < 6 ? 1 : 0; n.near = d < 6; n.spd = 0; n.phase += dt;
    });
    G.villagers.forEach(function (v) {
      if (v.pause > 0) { v.pause -= dt; v.spd = lerp(v.spd, 0, 1 - Math.exp(-dt * 6)); }
      else {
        var t = v.path[v.wi], dx = t[0] - v.x, dz = t[1] - v.z, dd = Math.hypot(dx, dz);
        if (dd < 0.3) {
          if (v.loop) { v.wi = (v.wi + 1) % v.path.length; }
          else { if (v.wi === v.path.length - 1 || v.wi === 0) { v.dir *= -1; v.pause = 1.5 + Math.random() * 2; } v.wi += v.dir; }
        } else { var sp = 1.5; v.x += dx / dd * sp * dt; v.z += dz / dd * sp * dt; v.rot += angDiff(v.rot, Math.atan2(dx, dz)) * Math.min(1, dt * 6); v.spd = sp; }
      }
      v.phase += v.spd * dt * 2.1; v.y = groundY(v.x, v.z);
      var dp = p ? Math.hypot(p.x - v.x, p.z - v.z) : 99; v.near = dp < 4;
      if (v.near && v.pause <= 0) { v.pause = 0.3; v.rot += angDiff(v.rot, Math.atan2(p.x - v.x, p.z - v.z)) * Math.min(1, dt * 8); }
    });
  }
  function checkHarta() {
    var p = G.player;
    G.harta.forEach(function (h) {
      if (h.got) { return; }
      if (Math.hypot(p.x - h.x, p.z - h.z) < 1.35) { h.got = true; collectHarta(h.i); for (var k = 0; k < 16; k++) { burst(h.x, h.y, h.z, 3, [1, 0.85, 0.35], 1.2); } }
    });
  }

  /* ---------- particles ---------- */
  var PS = [];
  function emitP(o) { if (PS.length < 640) { PS.push(o); } }
  function burst(x, y, z, kind, col, life) {
    var a = Math.random() * TAU, sp = 1.2 + Math.random() * 2.4;
    emitP({ x: x, y: y, z: z, vx: Math.cos(a) * sp, vy: 1.5 + Math.random() * 2.5, vz: Math.sin(a) * sp, g: -3.2, life: life || 1.4, max: life || 1.4, s: kind === 1 ? 0.5 : 0.22, c: col, k: kind, add: kind !== 1 && kind !== 2 });
  }
  function heartBurst(x, y, z) { for (var i = 0; i < 18; i++) { burst(x, y, z, 1, i % 2 ? [1, 0.42, 0.55] : [1, 0.7, 0.78], 1.6); } }
  function updateParticles(dt) {
    var env = G.env, cu = G.cam.cur || { tx: 0, tz: 0 }, cx = cu.tx, cz = cu.tz, rad = G.cam.mode === "follow" ? 24 : 42;
    G.pCount = G.pCount || { petal: 0, fly: 0, spark: 0 };
    var pc = G.pCount;
    if (!reduceMotion) {
      if (pc.petal < (G.cam.mode === "follow" ? 46 : 60) && Math.random() < dt * 24) {
        var a = Math.random() * TAU, r = Math.random() * rad, x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
        emitP({ x: x, y: groundY(x, z) + 5 + Math.random() * 6, z: z, vx: 0.5 + Math.random() * 0.4, vy: -0.45 - Math.random() * 0.4, vz: 0.15, g: 0, life: 13, max: 13, s: 0.17, c: Math.random() < 0.6 ? [1, 0.76, 0.84] : [1, 0.97, 0.94], k: 2, add: false, petal: 1, seed: Math.random() * 9 });
        pc.petal++;
      }
      if (env.night > 0.35 && pc.fly < 46 && Math.random() < dt * 22) {
        var a2 = Math.random() * TAU, r2 = Math.random() * rad * 0.8, x2 = cx + Math.cos(a2) * r2, z2 = cz + Math.sin(a2) * r2;
        if (height(x2, z2) > 0.5) { emitP({ x: x2, y: groundY(x2, z2) + 0.4 + Math.random() * 2, z: z2, vx: 0, vy: 0, vz: 0, g: 0, life: 7, max: 7, s: 0.2, c: [0.85, 1, 0.45], k: 0, add: true, fly: 1, seed: Math.random() * 9 }); pc.fly++; }
      }
      var fire = G.locByID && G.locByID.countdown;
      if (fire && pc.spark < 16 && Math.random() < dt * 14) { emitP({ x: 10 + (Math.random() - 0.5) * 0.5, y: height(10, 19) + 0.6, z: 19 + (Math.random() - 0.5) * 0.5, vx: (Math.random() - 0.5) * 0.4, vy: 1.4 + Math.random(), vz: (Math.random() - 0.5) * 0.4, g: 0, life: 1.6, max: 1.6, s: 0.12, c: [1, 0.7, 0.3], k: 3, add: true, spark: 1 }); pc.spark++; }
      G.harta.forEach(function (h) { if (!h.got && Math.random() < dt * 3) { emitP({ x: h.x + (Math.random() - 0.5), y: h.y - 0.4, z: h.z + (Math.random() - 0.5), vx: 0, vy: 0.8, vz: 0, g: 0, life: 1.4, max: 1.4, s: 0.16, c: [1, 0.9, 0.45], k: 3, add: true }); } });
    }
    var n = 0, t = G.t;
    for (var i = PS.length - 1; i >= 0; i--) {
      var p = PS[i];
      p.life -= dt;
      if (p.life <= 0 || (p.fly && env.night < 0.3)) { if (p.petal) { pc.petal--; } if (p.fly) { pc.fly--; } if (p.spark) { pc.spark--; } PS[i] = PS[PS.length - 1]; PS.pop(); continue; }
      if (p.petal) { p.x += (p.vx + Math.sin(t * 1.3 + p.seed) * 0.5) * dt; p.z += (p.vz + Math.cos(t * 1.1 + p.seed) * 0.35) * dt; p.y += p.vy * dt; if (p.y < groundY(p.x, p.z) + 0.05) { p.y = groundY(p.x, p.z) + 0.05; p.vx *= 0.9; p.vy = 0; } }
      else if (p.fly) { p.x += Math.sin(t * 0.7 + p.seed) * 0.35 * dt; p.z += Math.cos(t * 0.9 + p.seed * 1.3) * 0.35 * dt; p.y += Math.sin(t * 1.3 + p.seed) * 0.12 * dt; }
      else { p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; }
    }
  }
  function writeParticles() {
    var d = R.pData, n = 0, t = G.t;
    var pass = function (add) {
      for (var i = 0; i < PS.length && n < R.pMax; i++) {
        var p = PS[i]; if (!!p.add !== add) { continue; }
        var age = p.max - p.life, a = Math.min(1, age / 0.5, p.life / 0.9);
        if (p.fly) { a *= (0.5 + 0.5 * Math.sin(t * 3.1 + p.seed * 4)) * G.env.night; }
        var o = n * 9;
        d[o] = p.x; d[o + 1] = p.y; d[o + 2] = p.z; d[o + 3] = p.s; d[o + 4] = p.c[0]; d[o + 5] = p.c[1]; d[o + 6] = p.c[2]; d[o + 7] = a; d[o + 8] = p.k; n++;
      }
    };
    pass(false); var nA = n; pass(true);
    return [nA, n];
  }
  function drawParticles() {
    var gl = R.gl, cnt = writeParticles();
    if (!cnt[1]) { return; }
    gl.useProgram(R.part.p); gl.uniformMatrix4fv(R.part.u.uVP, false, R.vp); gl.uniform1f(R.part.u.uScale, R.h * 0.5 / Math.tan(R.fov / 2));
    gl.bindVertexArray(R.pVao); gl.bindBuffer(gl.ARRAY_BUFFER, R.pBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, R.pData.subarray(0, cnt[1] * 9));
    if (cnt[0]) { gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.drawArrays(gl.POINTS, 0, cnt[0]); }
    if (cnt[1] > cnt[0]) { gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.drawArrays(gl.POINTS, cnt[0], cnt[1] - cnt[0]); }
  }

  /* ---------- drawing ---------- */
  var MP = M4.create();
  function drawProps() {
    var t = G.t, env = G.env;
    M4.ident(MP); M4.translate(MP, 19, height(19, -16) + 4.7, -16); M4.rotY(MP, 0.6); M4.translate(MP, 0, 0, 1.12); M4.rotZ(MP, t * 0.7); drawMesh(R, PRIM.blades, MP);
    G.boats.forEach(function (b, i) {
      b.a += b.sp * (1 / 60);
      var x = Math.cos(b.a) * b.r, z = Math.sin(b.a) * b.r;
      M4.ident(MP); M4.translate(MP, x, Math.sin(t * 1.3 + b.ph) * 0.12 + 0.1, z); M4.rotY(MP, -b.a + (b.sp > 0 ? 0 : Math.PI)); M4.rotZ(MP, Math.sin(t * 1.1 + i) * 0.06);
      drawMesh(R, PRIM.boat, MP); drawMesh(R, PRIM.sail, MP);
    });
    M4.ident(MP); M4.translate(MP, G.dock.x, Math.sin(t * 1.4) * 0.08 + 0.05, G.dock.z); M4.rotY(MP, 0.08); M4.rotX(MP, Math.sin(t * 1.2) * 0.03); drawMesh(R, PRIM.boat, MP);
    M4.ident(MP); M4.translate(MP, 0, height(0, -21) + 10.85 + Math.sin(t * 1.6) * 0.1, -21); M4.rotY(MP, t * 0.9); M4.rotX(MP, 0.18); drawMesh(R, PRIM.ring, MP);
    if (G.target && G.cam.mode === "follow") {
      var T = G.target;
      M4.ident(MP); M4.translate(MP, T.x, T.by + T.top + 1.4 + Math.sin(t * 2) * 0.25, T.z); M4.rotY(MP, t * 1.6); M4.scale(MP, 0.7, 0.9, 0.7); drawMesh(R, PRIM.gem, MP);
    }
    G.harta.forEach(function (h) {
      if (h.got) { return; }
      M4.ident(MP); M4.translate(MP, h.x, h.y + Math.sin(t * 2.4 + h.i) * 0.15, h.z); M4.rotY(MP, t * 2 + h.i); M4.scale(MP, 0.34, 0.42, 0.34); drawMesh(R, PRIM.gem, MP, [1, 0.72, 0.85]);
    });
    var cn = env.night, CLOUD_T = [lerp(1.5, 0.62, cn), lerp(1.5, 0.66, cn), lerp(1.55, 0.9, cn)];
    G.clouds.forEach(function (c) {
      c.x += c.sp * (1 / 60); if (c.x > 70) { c.x = -70; }
      M4.ident(MP); M4.translate(MP, c.x, c.y, c.z); M4.scale(MP, c.s, c.s, c.s); drawMesh(R, PRIM.cloud, MP, CLOUD_T);
    });
    G.birds.forEach(function (b) {
      var a = t * 0.16 + b.off * 0.12, x = Math.cos(a) * 20 + b.off * 0.6, z = Math.sin(a) * 20 - 4 + (b.off % 2) * 1.2, y = 15 + Math.sin(t * 0.8 + b.off) * 0.6, flap = Math.sin(t * 8 + b.ph) * 0.6;
      M4.ident(MP); M4.translate(MP, x, y, z); M4.rotY(MP, -a); M4.rotZ(MP, flap); drawMesh(R, PRIM.wingL, MP);
      M4.ident(MP); M4.translate(MP, x, y, z); M4.rotY(MP, -a); M4.rotZ(MP, -flap); drawMesh(R, PRIM.wingR, MP);
    });
    G.lanterns.forEach(function (l) { M4.ident(MP); M4.translate(MP, l.x, l.y, l.z); M4.rotY(MP, l.r); drawMesh(R, PRIM.lantern, MP); });
    if (G.locByID.countdown) {
      var fy = height(10, 19) + 0.2;
      M4.ident(MP); M4.translate(MP, 10, fy, 19); M4.scale(MP, 1 + Math.sin(t * 13) * 0.08, 1.1 + Math.sin(t * 9.7) * 0.18, 1 + Math.cos(t * 11) * 0.08); drawMesh(R, PRIM.flame, MP);
      M4.ident(MP); M4.translate(MP, 10.02, fy, 19.02); M4.scale(MP, 1, 0.8 + Math.sin(t * 15) * 0.15, 1); drawMesh(R, PRIM.flame2, MP);
    }
  }
  function drawActors() {
    var gl = R.gl;
    G.npcs.forEach(drawChar); G.villagers.forEach(drawChar);
    if (G.locByID.countdown) { G.cat.y = height(G.cat.x, G.cat.z); drawCat(G.cat); }
    if (!G.player) { return; }
    if (G.cam.mode === "follow") {
      gl.depthFunc(gl.GREATER); gl.depthMask(false); gl.enable(gl.BLEND);
      gl.uniform4f(R.main.u.uFlat, 1, 0.86, 0.4, 0.45); drawChar(G.player); gl.uniform4f(R.main.u.uFlat, 0, 0, 0, 0);
      gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.disable(gl.BLEND);
    }
    drawChar(G.player);
  }
  function drawWater(env) {
    var gl = R.gl, u = R.water.u;
    gl.useProgram(R.water.p);
    gl.uniformMatrix4fv(u.uVP, false, R.vp); gl.uniform1f(u.uTime, G.t);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, R.hTex); gl.uniform1i(u.uHeight, 2); gl.uniform3fv(u.uHRect, R.hRect);
    gl.uniform3fv(u.uCamPos, R.camPos); gl.uniform3fv(u.uSunDir, env.sunDisk[1] > 0 ? env.sunDisk : env.moonDir); gl.uniform3fv(u.uSunCol, env.sunCol);
    gl.uniform3fv(u.uFogCol, env.fog); gl.uniform1f(u.uFogDen, env.fogDen); gl.uniform1f(u.uNight, env.night);
    gl.uniform3fv(u.uSkyHor, env.hor); gl.uniform3fv(u.uSkyTop, env.top); gl.uniform3fv(u.uShallow, env.shallow); gl.uniform3fv(u.uDeep, env.deep);
    gl.bindVertexArray(R.waterMesh.vao); gl.drawArrays(gl.TRIANGLES, 0, R.waterMesh.n);
  }
  function drawGlows(env) {
    var gl = R.gl, t = G.t;
    gl.useProgram(R.glow.p); gl.uniformMatrix4fv(R.glow.u.uVP, false, R.vp); gl.bindVertexArray(R.quad.vao);
    if (G.target && G.cam.mode === "follow") { var T = G.target; drawGlow(R, [T.x, T.by, T.z], 3.2, 24, [1, 0.84, 0.35], 0.34 + Math.sin(t * 2) * 0.06, 0, true); }
    drawGlow(R, [0, height(0, -21) + 10.9, -21], 5, 5, [0.5, 0.95, 1], 0.35 + env.night * 0.45, 1, false);
    if (env.night > 0.12) { LAMPS.forEach(function (l) { drawGlow(R, l, 1.9, 1.9, [1, 0.8, 0.45], env.night * 0.8, 1, false); }); }
    G.lanterns.forEach(function (l) { drawGlow(R, [l.x, l.y + 1.28, l.z], 1.4, 1.4, [1, 0.72, 0.35], 0.35 + env.night * 0.55, 1, false); });
    if (G.locByID.countdown) { drawGlow(R, [10, height(10, 19) + 0.7, 19], 3.4 + Math.sin(t * 9) * 0.2, 3.4, [1, 0.6, 0.25], 0.45 + env.night * 0.4, 1, false); }
    G.harta.forEach(function (h) { if (!h.got) { drawGlow(R, [h.x, h.y - 0.9, h.z], 1.2, 5, [1, 0.88, 0.5], 0.28, 0, true); } });
  }
  function render() {
    var gl = R.gl, env = G.env;
    if (R.shadowOK && R.shadowDirty) {
      R.inShadowPass = true;
      gl.bindFramebuffer(gl.FRAMEBUFFER, R.shFB); gl.viewport(0, 0, R.shSize, R.shSize); gl.depthMask(true); gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(2.2, 4);
      gl.useProgram(R.depth.p); gl.uniformMatrix4fv(R.depth.u.uLightVP, false, R.lightVP); gl.uniform1f(R.depth.u.uTime, 0); gl.uniform1f(R.depth.u.uWind, 0);
      drawDepth(R, R.staticMesh, R.ident);
      gl.disable(gl.POLYGON_OFFSET_FILL); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      R.shadowDirty = false; R.inShadowPass = false;
    }
    gl.viewport(0, 0, R.w, R.h);
    gl.clearColor(env.fog[0], env.fog[1], env.fog[2], 1); gl.depthMask(true); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST); gl.depthMask(false); gl.disable(gl.BLEND);
    var su = R.sky.u; gl.useProgram(R.sky.p);
    gl.uniformMatrix4fv(su.uInvVP, false, R.inv); gl.uniform3fv(su.uCamPos, R.camPos); gl.uniform3fv(su.uSkyTop, env.top); gl.uniform3fv(su.uSkyHor, env.hor); gl.uniform3fv(su.uFogCol, env.fog);
    gl.uniform3fv(su.uSunDir, env.sunDisk); gl.uniform3fv(su.uSunCol, env.sunCol); gl.uniform3fv(su.uMoonDir, env.moonDir); gl.uniform1f(su.uNight, env.night); gl.uniform1f(su.uTime, G.t);
    gl.bindVertexArray(R.emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
    setMainUniforms(R, env, G.t);
    drawMesh(R, R.staticMesh, R.ident);
    drawProps(); drawActors();
    gl.enable(gl.BLEND); gl.depthMask(false);
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-1, -2);
    gl.useProgram(R.blob.p); gl.uniformMatrix4fv(R.blob.u.uVP, false, R.vp); gl.uniform1f(R.blob.u.uAlpha, 0.32 * (1 - env.night * 0.45)); gl.bindVertexArray(R.disc.vao);
    G.actors.forEach(function (a) { gl.uniform4f(R.blob.u.uBlob, a.x, a.y + 0.02, a.z, 0.52); gl.drawArrays(gl.TRIANGLES, 0, R.disc.n); });
    gl.disable(gl.POLYGON_OFFSET_FILL);
    drawWater(env);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    drawGlows(env);
    drawParticles();
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }

  /* ---------- loop ---------- */
  function gameActive() { return G.started && G.mode === "game" && !G.panel && !G.mapOpen && !G.viewerOpen && !G.traveling; }
  function wantRender() { return !!R && G.ready && !doc.hidden && !G.sleep && !G.lost; }
  function wake() { if (!G.raf && wantRender()) { G.last = 0; G.raf = requestAnimationFrame(loop); } }
  function loop(now) {
    if (!wantRender()) { G.raf = 0; return; }
    G.raf = requestAnimationFrame(loop);
    var dt = G.last ? (now - G.last) / 1000 : 0.016; G.last = now;
    if (dt > 0.1) { dt = 0.1; }
    if (G.mode === "page" && G.started) { G.acc = (G.acc || 0) + dt; if (G.acc < 0.033) { return; } dt = G.acc; G.acc = 0; }
    G.t += dt;
    if (!reduceMotion) { G.tod = (G.tod + dt * G.todSpeed) % 24; }
    G.env = envAt(G.tod);
    if (lightChanged(G.env.sunDir)) { updateLightVP(G.env.sunDir); }
    if (gameActive()) { updatePlayer(dt); updateTriggers(); checkHarta(); }
    updateNPCs(dt);
    updateCamera(dt);
    updateParticles(dt);
    render();
    if (G.mode === "game" && G.started) { updateOverlays(); updateCompass(); updateMinimap(); G.hudT = (G.hudT || 0) + dt; if (G.hudT > 0.25) { G.hudT = 0; updateHudSlow(); } }
    G.perf.acc += dt; G.perf.n++;
    if (G.perf.n >= 90) { var avg = G.perf.acc / G.perf.n; G.perf.acc = 0; G.perf.n = 0; if (avg > 0.03 && G.perf.scale > 0.55) { G.perf.scale -= 0.12; resizeGL(); } else if (avg < 0.017 && G.perf.scale < 1) { G.perf.scale = Math.min(1, G.perf.scale + 0.06); resizeGL(); } }
  }
  function renderOnce() { if (!R || !G.ready) { return; } G.env = G.env || envAt(G.tod); if (lightChanged(G.env.sunDir)) { updateLightVP(G.env.sunDir); } updateCamera(0); render(); if (G.mode === "game" && G.started) { updateOverlays(); updateCompass(); updateMinimap(); } }
  function resizeGL() {
    if (!R) { return; }
    var dpr = Math.min(window.devicePixelRatio || 1, 2) * G.perf.scale * (G.mode === "page" ? 0.72 : 1);
    var w = Math.max(1, Math.round(window.innerWidth * dpr)), h = Math.max(1, Math.round(window.innerHeight * dpr));
    if (R.canvas.width !== w || R.canvas.height !== h) { R.canvas.width = w; R.canvas.height = h; }
    R.w = w; R.h = h; R.cssW = window.innerWidth; R.cssH = window.innerHeight; R.aspect = R.cssW / Math.max(1, R.cssH);
    if (!G.raf) { renderOnce(); }
  }

  /* ---------- locations list (works with or without WebGL) ---------- */
  var QUEST_TXT = {
    hero: window.PULAU.translate("Kembali ke Dermaga Kedatangan"), prasasti: window.PULAU.translate("Baca Batu Prasasti di dekat dermaga"), couple: window.PULAU.translate("Kunjungi rumah ") + GROOM + " & " + BRIDE,
    kisah: window.PULAU.translate("Lihat pencapaian di Ruang Trofi"), countdown: window.PULAU.translate("Simpan progres di Api Unggun"), events: window.PULAU.translate("Datangi Pendopo Agung"), rundown: window.PULAU.translate("Lewati Gapura Janur"),
    venue: window.PULAU.translate("Naik ke Menara Sinkronisasi"), hotel: window.PULAU.translate("Cek Penginapan untuk tamu jauh"), dresscode: window.PULAU.translate("Ganti kostum di Ruang Ganti"), gallery: window.PULAU.translate("Masuk ke Studio Foto"),
    video: window.PULAU.translate("Tonton adegan di Bioskop"), misi: window.PULAU.translate("Ambil misi di Papan Misi"), harta: window.PULAU.translate("Buka jurnal di Kapal Karam"), rsvp: window.PULAU.translate("Isi formulir party di Balai Petualang"),
    gifts: window.PULAU.translate("Mampir ke Sumur Harapan"), wishes: window.PULAU.translate("Nyalakan lentera di Taman Pesan"), closing: window.PULAU.translate("Tutup hari di Bukit Senja")
  };
  function buildLocs() {
    var alive = aliveLocs();
    G.locs = []; G.locByID = {};
    alive.forEach(function (id, idx) {
      var L = WL[id];
      var doors = (L.doors || [{ x: L.door[0], z: L.door[1] }]).map(function (d) { return { x: d.x, z: d.z, who: d.who || "", lx: d.lx != null ? d.lx : L.x, lz: d.lz != null ? d.lz : L.z }; });
      var o = { id: id, name: L.name, ico: L.ico, c: L.c, x: L.x, z: L.z, r: L.r, doors: doors, top: L.top, by: height(L.x, L.z), idx: idx };
      G.locs.push(o); G.locByID[id] = o;
    });
  }
  function isVisited(id) { return save.visited.indexOf(id) >= 0; }
  function locLabel(L, d) { if (L.id === "couple" && d && d.who) { return window.PULAU.translate("Rumah ") + (d.who === "groom" ? GROOM : BRIDE); } return L.name; }

  /* ---------- triggers ---------- */
  function updateTriggers() {
    var p = G.player, best = null, bd = 1e9;
    for (var i = 0; i < G.locs.length; i++) {
      var L = G.locs[i];
      for (var j = 0; j < L.doors.length; j++) { var d = L.doors[j], dd = Math.hypot(p.x - d.x, p.z - d.z); if (dd < bd) { bd = dd; best = { L: L, d: d, dist: dd }; } }
    }
    G.near = best && bd < best.L.r + 2.2 ? best : null;
    var inside = best && bd < best.L.r ? best : null;
    var key = inside ? inside.L.id + ":" + inside.d.who : null;
    if (key !== G.insideKey) {
      G.insideKey = key;
      if (inside && (!isVisited(inside.L.id) || G.autoEnter === inside.L.id)) {
        var first = !isVisited(inside.L.id);
        G.autoEnter = null; p.target = null; p.vx = 0; p.vz = 0;
        enterLocation(inside.L, inside.d, first);
      }
    }
  }
  function enterLocation(L, d, first) {
    var p = G.player;
    if (p) { p.rot = Math.atan2(d.lx - p.x, d.lz - p.z); p.vx = 0; p.vz = 0; p.target = null; }
    if (first) {
      showDiscovery(L, d);
      sfx("discover");
      if (p && R) { heartBurst(p.x, p.y + 1.8, p.z); }
      G.traveling = true;
      setTimeout(function () { G.traveling = false; openPanel(L.id, { who: d.who }); }, reduceMotion ? 250 : 1250);
    } else { openPanel(L.id, { who: d.who }); }
  }
  function interact() {
    if (!gameActive()) { return; }
    if (G.near) { enterLocation(G.near.L, G.near.d, !isVisited(G.near.L.id)); }
  }
  /* ---------- path finding (A* on a walkability grid) ---------- */
  var NAV = null;
  function buildNavGrid() {
    var S = 0.8, N = 100, H0 = -40, g = new Uint8Array(N * N);
    for (var j = 0; j < N; j++) { for (var i = 0; i < N; i++) { g[j * N + i] = walkable(H0 + (i + 0.5) * S, H0 + (j + 0.5) * S) ? 1 : 0; } }
    NAV = { S: S, N: N, H0: H0, g: g };
  }
  function navCell(x, z) { return [clamp(Math.floor((x - NAV.H0) / NAV.S), 0, NAV.N - 1), clamp(Math.floor((z - NAV.H0) / NAV.S), 0, NAV.N - 1)]; }
  function navPos(i, j) { return [NAV.H0 + (i + 0.5) * NAV.S, NAV.H0 + (j + 0.5) * NAV.S]; }
  function clearLine(x0, z0, x1, z1) {
    var d = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(d / 0.3));
    for (var k = 1; k <= n; k++) { var t = k / n; if (!walkable(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t)) { return false; } }
    return true;
  }
  function nearestFree(i, j) {
    var N = NAV.N, g = NAV.g;
    if (g[j * N + i]) { return [i, j]; }
    for (var r = 1; r < 14; r++) {
      var best = null, bd = 1e9;
      for (var dj = -r; dj <= r; dj++) { for (var di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) { continue; }
        var ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N || !g[jj * N + ii]) { continue; }
        var dd = di * di + dj * dj; if (dd < bd) { bd = dd; best = [ii, jj]; }
      } }
      if (best) { return best; }
    }
    return null;
  }
  function findPath(x0, z0, x1, z1) {
    if (!NAV) { return null; }
    if (clearLine(x0, z0, x1, z1)) { return [[x1, z1]]; }
    var N = NAV.N, g = NAV.g, s = nearestFree(navCell(x0, z0)[0], navCell(x0, z0)[1]), t = nearestFree(navCell(x1, z1)[0], navCell(x1, z1)[1]);
    if (!s || !t) { return null; }
    var S = s[1] * N + s[0], T = t[1] * N + t[0];
    var gs = new Float32Array(N * N).fill(1e9), came = new Int32Array(N * N).fill(-1), closed = new Uint8Array(N * N);
    var heap = [], push = function (id, f) { heap.push([f, id]); var k = heap.length - 1; while (k > 0) { var pk = (k - 1) >> 1; if (heap[pk][0] <= heap[k][0]) { break; } var tmp = heap[pk]; heap[pk] = heap[k]; heap[k] = tmp; k = pk; } };
    var pop = function () { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var k = 0; for (;;) { var l = 2 * k + 1, r = l + 1, m = k; if (l < heap.length && heap[l][0] < heap[m][0]) { m = l; } if (r < heap.length && heap[r][0] < heap[m][0]) { m = r; } if (m === k) { break; } var tmp = heap[m]; heap[m] = heap[k]; heap[k] = tmp; k = m; } } return top; };
    var h = function (id) { var dx = Math.abs(id % N - t[0]), dz = Math.abs((id / N | 0) - t[1]); return (dx + dz) + (Math.SQRT2 - 2) * Math.min(dx, dz); };
    gs[S] = 0; push(S, h(S));
    var DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]], guard = 0;
    while (heap.length && guard++ < 12000) {
      var cur = pop()[1];
      if (cur === T) { break; }
      if (closed[cur]) { continue; }
      closed[cur] = 1;
      var ci = cur % N, cj = cur / N | 0;
      for (var k = 0; k < 8; k++) {
        var ni = ci + DIRS[k][0], nj = cj + DIRS[k][1];
        if (ni < 0 || nj < 0 || ni >= N || nj >= N) { continue; }
        var nid = nj * N + ni;
        if (!g[nid] || closed[nid]) { continue; }
        if (k > 3 && (!g[cj * N + ni] || !g[nj * N + ci])) { continue; }
        var ng = gs[cur] + DIRS[k][2];
        if (ng < gs[nid]) { gs[nid] = ng; came[nid] = cur; push(nid, ng + h(nid)); }
      }
    }
    if (came[T] < 0 && T !== S) { return null; }
    var cells = [], c = T;
    while (c >= 0 && c !== S) { cells.push(navPos(c % N, c / N | 0)); c = came[c]; }
    cells.reverse(); cells.push([x1, z1]);
    var out = [], px = x0, pz = z0, idx = 0;
    while (idx < cells.length) {
      var far = idx;
      for (var q = cells.length - 1; q > idx; q--) { if (clearLine(px, pz, cells[q][0], cells[q][1])) { far = q; break; } }
      out.push(cells[far]); px = cells[far][0]; pz = cells[far][1]; idx = far + 1;
    }
    return out;
  }
  function goTo(x, z) { var p = G.player, path = findPath(p.x, p.z, x, z); p.path = path && path.length ? path : [[x, z]]; p.target = p.path[0]; }
  function walkToDoor(L, d) {
    if (!G.player) { travelTo(L.id, { who: d.who }); return; }
    var p = G.player;
    if (Math.hypot(p.x - d.x, p.z - d.z) < L.r) { enterLocation(L, d, !isVisited(L.id)); return; }
    goTo(d.x, d.z); G.autoEnter = L.id; G.insideKey = null;
    ringAt(d.x, d.z);
  }
  function ringAt(x, z) { if (!R) { return; } var y = groundY(x, z) + 0.15; for (var i = 0; i < 12; i++) { var a = i / 12 * TAU; emitP({ x: x + Math.cos(a) * 0.5, y: y, z: z + Math.sin(a) * 0.5, vx: Math.cos(a) * 1.4, vy: 0.6, vz: Math.sin(a) * 1.4, g: -1, life: 0.6, max: 0.6, s: 0.2, c: [1, 0.9, 0.5], k: 0, add: true }); } }
  function tapWorld(sx, sy) {
    if (!gameActive()) { return; }
    var hit = null, best = 70;
    G.locs.forEach(function (L) {
      L.doors.forEach(function (d) {
        var s = project(d.lx, L.by + 1.6, d.lz);
        if (s.w <= 0) { return; }
        var dd = Math.hypot(s.x - sx, s.y - sy), lim = clamp(700 / s.w, 40, 120);
        if (dd < lim && dd < best + lim) { best = dd; hit = { L: L, d: d }; }
      });
    });
    if (hit) { walkToDoor(hit.L, hit.d); return; }
    var g = raycastGround(sx, sy);
    if (!g) { return; }
    var gx = g[0], gz = g[1];
    if (!walkable(gx, gz)) { for (var i = 0; i < 12 && !walkable(gx, gz); i++) { gx = lerp(gx, G.player.x, 0.2); gz = lerp(gz, G.player.z, 0.2); } }
    goTo(gx, gz); G.autoEnter = null; ringAt(gx, gz);
  }

  /* ---------- input ---------- */
  function isTyping(t) { return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable); }
  var KEYMAP = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right", shift: "run", q: "rotL", e: "rotR" };
  function bindInput() {
    window.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if (k === "escape") { escapeAll(); return; }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) { return; }
      if (G.viewerOpen) { if (k === "arrowleft") { viewerStep(-1); e.preventDefault(); } else if (k === "arrowright") { viewerStep(1); e.preventDefault(); } return; }
      if (!gameActive()) { if (k === "m" && G.mode === "game" && G.started && G.mapOpen) { closeMap(); } return; }
      if (KEYMAP[k]) { G.keys[KEYMAP[k]] = true; if (k.indexOf("arrow") === 0) { e.preventDefault(); } }
      else if (k === "enter" || k === " ") { e.preventDefault(); interact(); }
      else if (k === "m") { openMap(); }
    });
    window.addEventListener("keyup", function (e) { var k = (e.key || "").toLowerCase(); if (KEYMAP[k]) { G.keys[KEYMAP[k]] = false; } });
    window.addEventListener("blur", function () { G.keys = {}; });
    var joy = $("joystick"), knob = $("joy-knob");
    var joyMove = function (e) {
      var r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy, max = r.width * 0.36, l = Math.hypot(dx, dy);
      if (l > max) { dx = dx / l * max; dy = dy / l * max; }
      G.joy.x = dx / max; G.joy.y = -dy / max;
      knob.style.transform = "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px,0)";
    };
    var joyEnd = function () { G.joy.on = false; G.joy.x = 0; G.joy.y = 0; knob.style.transform = ""; joy.classList.remove("is-active"); };
    joy.addEventListener("pointerdown", function (e) { e.preventDefault(); try { joy.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } G.joy.on = true; G.joy.id = e.pointerId; joy.classList.add("is-active"); joyMove(e); if (G.player) { G.player.target = null; } });
    joy.addEventListener("pointermove", function (e) { if (G.joy.on && e.pointerId === G.joy.id) { joyMove(e); } });
    joy.addEventListener("pointerup", joyEnd); joy.addEventListener("pointercancel", joyEnd); joy.addEventListener("lostpointercapture", joyEnd);
    joy.addEventListener("touchstart", function (e) { e.preventDefault(); }, { passive: false });
    var cv = $("world-canvas"), ptrs = {}, start = null, pinch = 0;
    cv.addEventListener("pointerdown", function (e) {
      if (!gameActive()) { return; }
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      var ids = Object.keys(ptrs);
      if (ids.length === 1) { start = { x: e.clientX, y: e.clientY, t: performance.now(), drag: false }; }
      else if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = Math.hypot(a.x - b.x, a.y - b.y); if (start) { start.drag = true; } }
    });
    cv.addEventListener("pointermove", function (e) {
      var q = ptrs[e.pointerId]; if (!q) { return; }
      var dx = e.clientX - q.x, dy = e.clientY - q.y; q.x = e.clientX; q.y = e.clientY;
      var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch > 0) { G.cam.zoomT = clamp(G.cam.zoomT * pinch / d, 9, 34); } pinch = d; return; }
      if (!start) { return; }
      if (!start.drag && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 9) { start.drag = true; }
      if (start.drag) { G.cam.yaw -= dx * 0.0085; G.cam.pitch = clamp(G.cam.pitch + dy * 0.004, 0.42, 1.18); }
    });
    var up = function (e) {
      var had = ptrs[e.pointerId]; delete ptrs[e.pointerId];
      if (Object.keys(ptrs).length < 2) { pinch = 0; }
      if (had && start && !start.drag && performance.now() - start.t < 450 && e.type === "pointerup") { tapWorld(e.clientX, e.clientY); }
      if (!Object.keys(ptrs).length) { start = null; }
    };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", function (e) { if (!gameActive()) { return; } e.preventDefault(); G.cam.zoomT = clamp(G.cam.zoomT * (1 + e.deltaY * 0.0012), 9, 34); }, { passive: false });
    $("btn-action").addEventListener("click", function () { sfx("click"); interact(); });
    $("btn-rotate").addEventListener("click", function () { sfx("click"); G.cam.yaw += Math.PI / 2; });
    $("btn-map").addEventListener("click", function () { sfx("click"); openMap(); });
    $("hud-minimap").addEventListener("click", function () { sfx("click"); openMap(); });
  }

  /* ---------- world markers, bubbles, lanterns ---------- */
  function buildMarkers() {
    var layer = $("world-layer"); layer.innerHTML = ""; G.markers = []; G.bubbles = [];
    G.locs.forEach(function (L) {
      L.doors.forEach(function (d, i) {
        var label = locLabel(L, d);
        var b = el("button", "mk", "mk-" + L.id + (L.doors.length > 1 ? "-" + d.who : ""));
        b.type = "button";
        b.style.setProperty("--c", L.c); b.style.setProperty("--d", (-(L.idx * 0.37 + i * 0.7)).toFixed(2) + "s");
        b.setAttribute("aria-label", window.PULAU.translate("Berjalan ke ") + label);
        b.innerHTML = '<span class="mk-in" id="' + mkId("mki") + '"><span class="mk-label" id="' + mkId("mkl") + '"></span><span class="mk-badge" id="' + mkId("mkb") + '">' + icon(L.ico) + '<span class="mk-check" id="' + mkId("mkc") + '">' + icon("i-check") + '</span></span><span class="mk-tail" id="' + mkId("mkt") + '"></span><span class="mk-dist" id="' + mkId("mkd") + '"></span></span>';
        b.querySelector(".mk-label").textContent = label;
        b.addEventListener("click", function (e) { e.stopPropagation(); if (!gameActive()) { return; } sfx("click"); walkToDoor(L, d); });
        layer.appendChild(b);
        G.markers.push({ el: b, L: L, d: d, wx: d.lx, wz: d.lz, wy: L.by + L.top, dist: b.querySelector(".mk-dist"), vis: true, near: false, tgt: false, visited: false });
      });
    });
    G.npcs.concat(G.villagers).forEach(function (n) {
      if (!n.line) { return; }
      var bw = el("div", "bubble", "bubble-" + n.id);
      var inner = el("div", "bubble-in", "bubble-in-" + n.id);
      var nm = el("b", "", "bubble-name-" + n.id); nm.textContent = n.name;
      var tx = el("span", "", "bubble-text-" + n.id); tx.textContent = n.line;
      inner.appendChild(nm); inner.appendChild(tx); bw.appendChild(inner); layer.appendChild(bw);
      G.bubbles.push({ el: bw, n: n, on: false });
    });
    syncLanterns();
  }
  function syncLanterns() {
    if (!R || !G.ready || !isAlive("wishes")) { return; }
    var layer = $("world-layer");
    qsa(".lamp-mk", layer).forEach(function (e) { e.remove(); });
    G.lanterns = [];
    var cards = qsa("#wish-list .wish-card").slice(0, 24);
    cards.forEach(function (c, i) {
      var a = i * 2.39996 + 0.5, rr = 2.4 + Math.sqrt(i) * 1.15, x = 20.5 + Math.cos(a) * rr, z = 12.5 + Math.sin(a) * rr * 0.8;
      if (height(x, z) < 0.45) { return; }
      var nameEl = c.querySelector('[data-field="name"]'), msgEl = c.querySelector('[data-field="message"]');
      var lam = { x: x, z: z, y: groundY(x, z), r: a, name: nameEl ? nameEl.textContent : "", msg: msgEl ? msgEl.textContent : "" };
      var b = el("button", "lamp-mk", mkId("lamp")); b.type = "button"; b.setAttribute("aria-label", window.PULAU.translate("Baca pesan dari ") + lam.name);
      b.innerHTML = '<span id="' + mkId("lampg") + '"></span>';
      var bub = el("div", "bubble", mkId("lampb")), bin = el("div", "bubble-in", mkId("lampbi")), bn = el("b", "", mkId("lampbn")), bt = el("span", "", mkId("lampbt"));
      bn.textContent = window.PULAU.translate("Pesan dari ") + lam.name; bt.textContent = lam.msg.length > 140 ? lam.msg.slice(0, 137) + "…" : lam.msg;
      bin.appendChild(bn); bin.appendChild(bt); bub.appendChild(bin);
      b.addEventListener("click", function (e) { e.stopPropagation(); lam.open = !lam.open; sfx("click"); });
      layer.appendChild(b); layer.appendChild(bub);
      lam.btn = b; lam.bub = bub; G.lanterns.push(lam);
    });
  }
  function updateOverlays() {
    var p = G.player, W = R.cssW, H = R.cssH;
    for (var i = 0; i < G.markers.length; i++) {
      var m = G.markers[i], s = project(m.wx, m.wy, m.wz);
      var vis = s.w > 0.5 && s.x > -80 && s.x < W + 80 && s.y > -80 && s.y < H + 100;
      if (vis !== m.vis) { m.el.classList.toggle("is-hidden", !vis); m.vis = vis; }
      if (!vis) { continue; }
      var dist = Math.hypot(p.x - m.d.x, p.z - m.d.z), sc = clamp(24 / s.w, 0.5, 1.1);
      m.el.style.transform = "translate3d(" + s.x.toFixed(1) + "px," + s.y.toFixed(1) + "px,0) scale(" + sc.toFixed(3) + ")";
      m.el.style.zIndex = String(Math.round(2000 - s.w * 10));
      var near = dist < 11; if (near !== m.near) { m.el.classList.toggle("is-near", near); m.near = near; }
      var tgt = !!G.target && G.target.id === m.L.id; if (tgt !== m.tgt) { m.el.classList.toggle("is-target", tgt); m.tgt = tgt; }
      var vv = isVisited(m.L.id); if (vv !== m.visited) { m.el.classList.toggle("is-visited", vv); m.visited = vv; }
      if (tgt) { m.dist.textContent = Math.round(dist) + " m"; }
    }
    for (var j = 0; j < G.bubbles.length; j++) {
      var b = G.bubbles[j], n = b.n, on = !!n.near && G.cam.mode === "follow";
      if (on) { var sb = project(n.x, n.y + 2.35, n.z); b.el.style.transform = "translate3d(" + sb.x.toFixed(1) + "px," + sb.y.toFixed(1) + "px,0)"; }
      if (on !== b.on) { b.el.classList.toggle("is-on", on); b.on = on; }
    }
    for (var k = 0; k < G.lanterns.length; k++) {
      var l = G.lanterns[k], sl = project(l.x, l.y + 1.3, l.z), close = Math.hypot(p.x - l.x, p.z - l.z) < 3.2;
      var lv = sl.w > 0.5 && sl.x > -40 && sl.x < W + 40 && sl.y > -40 && sl.y < H + 40;
      l.btn.style.display = lv ? "" : "none";
      if (lv) { l.btn.style.transform = "translate3d(" + sl.x.toFixed(1) + "px," + sl.y.toFixed(1) + "px,0)"; l.bub.style.transform = "translate3d(" + sl.x.toFixed(1) + "px," + (sl.y - 18).toFixed(1) + "px,0)"; }
      var show = lv && (l.open || close);
      l.bub.classList.toggle("is-on", show);
      if (!close && !l.open) { l.open = false; }
    }
  }

  /* ---------- compass ---------- */
  var CP = [];
  function buildCompass() {
    var strip = $("compass-strip"); strip.innerHTML = ""; CP = [];
    var dirs = window.PULAU.compass.map(function (label, i) { return [label, [0,1,0,-1][i], [-1,0,1,0][i], i === 0 ? "cp-card cp-n" : "cp-card"]; });
    dirs.forEach(function (d) { var e = el("span", "cp-mark " + d[3], mkId("cp")); e.textContent = d[0]; strip.appendChild(e); CP.push({ el: e, vx: d[1], vz: d[2], fixed: true }); });
    for (var i = 0; i < 16; i++) { if (i % 4 === 0) { continue; } var a = i / 16 * TAU; var e2 = el("span", "cp-tick", mkId("cpt")); strip.appendChild(e2); CP.push({ el: e2, vx: Math.sin(a), vz: -Math.cos(a), fixed: true }); }
    G.locs.forEach(function (L) { var e3 = el("span", "cp-mark cp-loc", "cp-" + L.id); e3.innerHTML = icon(L.ico); strip.appendChild(e3); CP.push({ el: e3, L: L }); });
  }
  function updateCompass() {
    var strip = $("compass-strip"), W = strip.clientWidth || 200, yaw = G.cam.cur ? G.cam.cur.yaw : 0, p = G.player, half = 1.35;
    var fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    for (var i = 0; i < CP.length; i++) {
      var c = CP[i], vx, vz;
      if (c.fixed) { vx = c.vx; vz = c.vz; } else { vx = c.L.x - p.x; vz = c.L.z - p.z; }
      var a = Math.atan2(vx * rx + vz * rz, vx * fx + vz * fz);
      if (Math.abs(a) > half) { if (c.shown !== false) { c.el.style.visibility = "hidden"; c.shown = false; } continue; }
      if (c.shown !== true) { c.el.style.visibility = "visible"; c.shown = true; }
      var x = W / 2 + a / half * W / 2;
      c.el.style.transform = "translate3d(" + x.toFixed(1) + "px,-50%,0) translateX(-50%)";
      if (c.L) { var tg = !!G.target && G.target.id === c.L.id; if (tg !== c.tg) { c.el.classList.toggle("is-target", tg); c.tg = tg; } }
    }
  }

  /* ---------- maps (minimap, world map, fallback) ---------- */
  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs, parent) { var e = doc.createElementNS(SVGNS, tag); e.setAttribute("id", mkId("s" + tag)); for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) { e.setAttribute(k, attrs[k]); } } if (parent) { parent.appendChild(e); } return e; }
  function coastPath(off, n) { var d = ""; for (var i = 0; i <= n; i++) { var a = i / n * TAU, r = coastR(a) - off; d += (i ? "L" : "M") + (Math.cos(a) * r).toFixed(2) + " " + (Math.sin(a) * r).toFixed(2); } return d + "Z"; }
  function roadPath(r) { return r.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(""); }
  function buildMinimap() {
    var g = $("mm-world"); g.innerHTML = "";
    svgEl("path", { d: coastPath(1.6, 90), "class": "mm-sand" }, g);
    svgEl("path", { d: coastPath(4.6, 90), "class": "mm-land" }, g);
    svgEl("circle", { cx: PLAZA.x, cy: PLAZA.z, r: PLAZA.r, fill: "#e6dcc8" }, g);
    svgEl("rect", { x: -1.5, y: 28.2, width: 3, height: 12.2, fill: "#c99561" }, g);
    ROADS.forEach(function (r) { svgEl("path", { d: roadPath(r), "class": "mm-road" }, g); });
    G.locs.forEach(function (L) { L.doors.forEach(function (d) { L.mm = svgEl("circle", { cx: d.lx, cy: d.lz, r: 1.25, fill: L.c, "class": "mm-dot" }, g); }); });
  }
  function updateMinimap() {
    var p = G.player, yaw = G.cam.cur ? G.cam.cur.yaw : 0, deg = yaw * 180 / Math.PI;
    $("mm-world").setAttribute("transform", "rotate(" + deg.toFixed(1) + ") translate(" + (-p.x).toFixed(2) + " " + (-p.z).toFixed(2) + ")");
    $("mm-player").setAttribute("transform", "rotate(" + ((Math.PI - p.rot + yaw) * 180 / Math.PI).toFixed(1) + ")");
    var mm = $("hud-minimap"), rad = (mm.clientWidth || 92) / 2 - 8;
    $("mm-north").style.transform = "translate3d(" + (Math.sin(yaw) * rad).toFixed(1) + "px," + (-Math.cos(yaw) * rad).toFixed(1) + "px,0)";
  }
  var MAPV = { x: -35, y: -31, w: 70, h: 72 };
  var MAP_HINT = finePointer ? window.PULAU.translate("Klik lokasi mana pun untuk perjalanan cepat.") : window.PULAU.translate("Ketuk penanda untuk melihat lokasi, lalu tekan Pergi.");
  function mapPct(x, z) { return [(x - MAPV.x) / MAPV.w * 100, (z - MAPV.y) / MAPV.h * 100]; }
  function buildWorldMap() {
    var svg = $("map-svg"); svg.innerHTML = "";
    var defs = svgEl("defs", {}, svg);
    var mask = svgEl("mask", { id: "fog-mask" }, defs);
    svgEl("rect", { x: -44, y: -44, width: 88, height: 88, fill: "#fff" }, mask);
    G.fogGroup = svgEl("g", {}, mask);
    svgEl("rect", { x: -44, y: -44, width: 88, height: 88, "class": "map-sea", opacity: 0.55 }, svg);
    for (var i = 0; i < 26; i++) { var wx = (hash2(i, 3) - 0.5) * 84, wz = (hash2(3, i) - 0.5) * 84; if (coastD(wx, wz) > -2) { continue; } svgEl("path", { d: "M" + wx.toFixed(1) + " " + wz.toFixed(1) + "q1.2 -1 2.4 0 q1.2 1 2.4 0", "class": "map-wave" }, svg); }
    svgEl("path", { d: coastPath(-1.4, 120), fill: "none", stroke: "#7a5427", "stroke-width": 0.25, "stroke-dasharray": "0.8 0.8", opacity: 0.6 }, svg);
    svgEl("path", { d: coastPath(1.6, 120), "class": "map-land" }, svg);
    svgEl("path", { d: coastPath(4.6, 120), "class": "map-grass" }, svg);
    [[0, -21, 9, 6.5], [0, -21, 5.5, 4], [-27, -3, 3.4, 2.6]].forEach(function (h) { svgEl("ellipse", { cx: h[0], cy: h[1], rx: h[2], ry: h[3], fill: "none", stroke: "#8a6a3a", "stroke-width": 0.25, opacity: 0.55 }, svg); });
    svgEl("circle", { cx: PLAZA.x, cy: PLAZA.z, r: PLAZA.r, fill: "#e9dcc0", stroke: "#8a5a22", "stroke-width": 0.3 }, svg);
    svgEl("rect", { x: -1.5, y: 28.2, width: 3, height: 12.2, fill: "#b98a55", stroke: "#6b4526", "stroke-width": 0.3 }, svg);
    ROADS.forEach(function (r) { svgEl("path", { d: roadPath(r), "class": "map-road" }, svg); });
    TREES.forEach(function (t) { svgEl("circle", { cx: t[0].toFixed(1), cy: t[1].toFixed(1), r: (0.55 + t[2] * 0.35).toFixed(2), "class": "map-tree" }, svg); });
    svgEl("rect", { x: -44, y: -44, width: 88, height: 88, "class": "map-fog", mask: "url(#fog-mask)" }, svg);
    var rose = svgEl("g", { transform: "translate(29.5 -25.5) scale(.85)" }, svg);
    svgEl("circle", { r: 5, fill: "rgba(255,248,232,.7)", stroke: "#4a2e12", "stroke-width": 0.3 }, rose);
    svgEl("path", { d: "M0 -4.2L1.1 0 0 4.2 -1.1 0Z", fill: "#c0263a" }, rose);
    svgEl("path", { d: "M-4.2 0L0 1.1 4.2 0 0 -1.1Z", fill: "#4a2e12", opacity: 0.7 }, rose);
    var tU = svgEl("text", { y: -5.6, "text-anchor": "middle", "class": "map-rose-t" }, rose); tU.textContent = window.PULAU.compass[0];
    var pins = $("map-pins"); pins.innerHTML = "";
    var order = domOrder();
    G.mapPins = []; G.mapSel = null;
    G.locs.slice().sort(function (a, b) { return order.indexOf(a.id) - order.indexOf(b.id); }).forEach(function (L) {
      L.doors.forEach(function (d) {
        var b = el("button", "map-pin", "pin-" + L.id + (d.who ? "-" + d.who : "")), pos = mapPct(d.lx, d.lz);
        b.type = "button"; b.style.left = pos[0].toFixed(2) + "%"; b.style.top = pos[1].toFixed(2) + "%"; b.style.setProperty("--c", L.c);
        b.innerHTML = '<span class="map-pin-badge" id="' + mkId("pb") + '">' + icon(L.ico) + '</span><span class="map-pin-lbl" id="' + mkId("pl") + '"></span>';
        var it = { L: L, d: d, pin: b, lbl: b.querySelector(".map-pin-lbl"), badge: b.querySelector(".map-pin-badge") };
        it.lbl.textContent = locLabel(L, d);
        b.setAttribute("aria-label", window.PULAU.translate("Perjalanan cepat ke ") + locLabel(L, d));
        b.addEventListener("click", function () { if (finePointer || G.mapSel === it) { G.mapSel = it; goMapSel(); } else { selectMapPin(it); } });
        pins.appendChild(b); d.pin = b; G.mapPins.push(it);
      });
    });
    var you = el("span", "", "map-you"); pins.appendChild(you);
    $("map-hint-t").textContent = MAP_HINT;
  }
  var LABEL_FIRST = ["hero", "couple", "events", "venue", "rsvp", "gifts", "wishes", "hotel"];
  function layoutMapLabels() {
    var fr = $("map-frame"), W = fr.clientWidth, H = fr.clientHeight;
    if (!W || !H || !G.mapPins) { return; }
    var boxes = [], placed = [], rank = function (it) { var k = LABEL_FIRST.indexOf(it.L.id); return k < 0 ? 50 + G.mapPins.indexOf(it) : k; };
    G.mapPins.forEach(function (it) {
      it.pin.classList.remove("lbl-top", "lbl-bottom", "lbl-left", "lbl-right", "lbl-sl", "lbl-sr", "lbl-ne", "lbl-nw", "lbl-se", "lbl-sw", "lbl-hide");
      it.bs = it.badge.offsetWidth || 30; it.lw = it.lbl.offsetWidth; it.lh = it.lbl.offsetHeight;
      it.cx = (it.d.lx - MAPV.x) / MAPV.w * W; it.cy = (it.d.lz - MAPV.y) / MAPV.h * H;
      boxes.push({ x: it.cx - it.bs / 2 - 1, y: it.cy - it.bs / 2 - 1, w: it.bs + 2, h: it.bs + 5, own: it });
    });
    var hit = function (r, own) {
      if (r.x < 3 || r.y < 3 || r.x + r.w > W - 3 || r.y + r.h > H - 3) { return true; }
      var i, o;
      for (i = 0; i < boxes.length; i++) { o = boxes[i]; if (o.own !== own && r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y) { return true; } }
      for (i = 0; i < placed.length; i++) { o = placed[i]; if (r.x < o.x + o.w + 3 && r.x + r.w + 3 > o.x && r.y < o.y + o.h + 2 && r.y + r.h + 2 > o.y) { return true; } }
      return false;
    };
    G.mapPins.slice().sort(function (a, b) { return rank(a) - rank(b); }).forEach(function (it) {
      var h = it.bs / 2, lw = it.lw, lh = it.lh, cx = it.cx, cy = it.cy, yt = cy - h - 3 - lh, yb = cy + h + 5;
      var cand = [[["lbl-top"], cx - lw / 2, yt], [["lbl-bottom"], cx - lw / 2, yb], [["lbl-right"], cx + h + 3, cy - lh / 2], [["lbl-left"], cx - h - 3 - lw, cy - lh / 2],
        [["lbl-top", "lbl-sr"], cx - h, yt], [["lbl-top", "lbl-sl"], cx + h - lw, yt], [["lbl-bottom", "lbl-sr"], cx - h, yb], [["lbl-bottom", "lbl-sl"], cx + h - lw, yb],
        [["lbl-ne"], cx + h * 0.6, cy - h * 0.6 - lh], [["lbl-nw"], cx - h * 0.6 - lw, cy - h * 0.6 - lh], [["lbl-se"], cx + h * 0.6, cy + h * 0.6 + 2], [["lbl-sw"], cx - h * 0.6 - lw, cy + h * 0.6 + 2]];
      for (var k = 0; k < cand.length; k++) {
        var r = { x: cand[k][1], y: cand[k][2], w: lw, h: lh };
        if (!hit(r, it)) { cand[k][0].forEach(function (c) { it.pin.classList.add(c); }); placed.push(r); return; }
      }
      it.pin.classList.add("lbl-hide");
    });
  }
  function selectMapPin(it) {
    if (G.mapSel) { G.mapSel.pin.classList.remove("is-sel"); }
    G.mapSel = it; it.pin.classList.add("is-sel");
    $("map-hint").classList.add("has-sel");
    setIcon($("map-hint-ico"), it.L.ico);
    $("map-hint-t").textContent = locLabel(it.L, it.d);
    sfx("click");
  }
  function clearMapSel() {
    if (G.mapSel) { G.mapSel.pin.classList.remove("is-sel"); G.mapSel = null; }
    $("map-hint").classList.remove("has-sel");
    setIcon($("map-hint-ico"), "i-info");
    $("map-hint-t").textContent = MAP_HINT;
  }
  function goMapSel() {
    var it = G.mapSel; if (!it) { return; }
    sfx("click"); closeMap(true); travelTo(it.L.id, { who: it.d.who });
  }
  function refreshWorldMap() {
    if (!G.fogGroup) { return; }
    G.fogGroup.innerHTML = "";
    var total = G.locs.length || 1, done = 0;
    G.locs.forEach(function (L) {
      var v = isVisited(L.id); if (v) { done++; }
      L.doors.forEach(function (d) {
        if (v) { svgEl("circle", { cx: d.lx, cy: d.lz, r: 10, fill: "#000" }, G.fogGroup); }
        if (d.pin) { d.pin.classList.toggle("is-visited", v); d.pin.classList.toggle("is-target", !!G.target && G.target.id === L.id); }
      });
    });
    var p = G.player || { x: 0, z: 36 };
    svgEl("circle", { cx: p.x.toFixed(1), cy: p.z.toFixed(1), r: 7, fill: "#000" }, G.fogGroup);
    $("map-progress-num").textContent = Math.round(done / total * 100) + "%";
    var you = $("map-you"), yp = mapPct(p.x, p.z); if (you) { you.style.left = clamp(yp[0], 3, 97).toFixed(2) + "%"; you.style.top = clamp(yp[1], 3, 97).toFixed(2) + "%"; }
  }
  function buildFallbackArt() {
    var svg = $("fallback-svg"); svg.innerHTML = "";
    svgEl("path", { d: coastPath(-2.5, 120), fill: "#63d3d6", opacity: 0.7 }, svg);
    svgEl("path", { d: coastPath(1.6, 120), fill: "#f3dfaa" }, svg);
    svgEl("path", { d: coastPath(4.6, 120), fill: "#86cf66" }, svg);
    svgEl("ellipse", { cx: 0, cy: -21, rx: 9, ry: 6.5, fill: "#6cbd5c" }, svg);
    svgEl("circle", { cx: PLAZA.x, cy: PLAZA.z, r: PLAZA.r, fill: "#e6dcc8" }, svg);
    ROADS.forEach(function (r) { svgEl("path", { d: roadPath(r), fill: "none", stroke: "#e8cf9c", "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg); });
    svgEl("rect", { x: -1.5, y: 28.2, width: 3, height: 12.2, fill: "#c99561" }, svg);
    for (var i = 0; i < 70; i++) { var x = (hash2(i, 9) - 0.5) * 60, z = (hash2(9, i) - 0.5) * 60; if (coastD(x, z) < 6 || roadDist(x, z) < 2 || Math.hypot(x, z) < 9) { continue; } svgEl("circle", { cx: x.toFixed(1), cy: z.toFixed(1), r: (0.9 + hash2(i, i) * 0.8).toFixed(2), fill: i % 3 ? "#4f9e4f" : "#3f8a47" }, svg); }
    Object.keys(WL).forEach(function (id) { var L = WL[id]; (L.doors || [{ lx: L.x, lz: L.z }]).forEach(function (d) { var x = d.lx != null ? d.lx : L.x, z = d.lz != null ? d.lz : L.z; svgEl("rect", { x: x - 1.6, y: z - 1.3, width: 3.2, height: 2.6, rx: 0.4, fill: "#fff3d6", stroke: "#2a2140", "stroke-width": 0.3 }, svg); svgEl("path", { d: "M" + (x - 2) + " " + (z - 1.2) + "L" + x + " " + (z - 3) + "L" + (x + 2) + " " + (z - 1.2) + "Z", fill: L.c, stroke: "#2a2140", "stroke-width": 0.3 }, svg); }); });
  }

  /* ---------- HUD ---------- */
  function updateHudSlow() {
    var env = G.env, h = Math.floor(G.tod), m = Math.floor((G.tod - h) * 60);
    $("clock-text").textContent = pad2(h) + "." + pad2(m);
    var night = env && env.night > 0.5;
    if (night !== G.clockNight) { G.clockNight = night; setIcon($("clock-ico"), (night ? "i-moon" : "i-sun")); }
    var p = G.player;
    if (G.target && p) { var d = G.target.doors[0], dist = Math.round(Math.hypot(p.x - d.x, p.z - d.z)); $("quest-dist").textContent = dist > 3 ? "± " + dist + window.PULAU.translate(" m dari sini") : window.PULAU.translate("Kamu sudah di sini"); }
    var ready = !!G.near && gameActive();
    var btn = $("btn-action");
    if (ready !== G.actReady) { G.actReady = ready; btn.classList.toggle("is-ready", ready); }
    if (ready) { $("action-label").textContent = G.near.L.id === "couple" ? window.PULAU.translate("Masuk") : isVisited(G.near.L.id) ? window.PULAU.translate("Masuk") : window.PULAU.translate("Jelajahi"); }
    var prompt = $("hud-prompt");
    if (ready && finePointer) { $("prompt-text").textContent = window.PULAU.translate("Masuk ke ") + locLabel(G.near.L, G.near.d); prompt.classList.add("is-on"); } else { prompt.classList.remove("is-on"); }
    var here = G.near ? G.near.L.id : null;
    if (here !== G.hereId) { if (G.hereId && navItem(G.hereId)) { navItem(G.hereId).classList.remove("is-here"); } if (here && navItem(here)) { navItem(here).classList.add("is-here"); } G.hereId = here; }
  }
  function updateQuest() {
    var order = domOrder(), done = 0, next = null;
    order.forEach(function (id) { if (isVisited(id)) { done++; } else if (!next) { next = id; } });
    G.target = next && G.locByID ? G.locByID[next] || null : null;
    $("quest-text").textContent = next ? QUEST_TXT[next] || window.PULAU.translate("Jelajahi pulau") : window.PULAU.translate("Semua lokasi sudah kamu jelajahi. Sampai jumpa di hari-H!");
    $("quest-count").textContent = done + "/" + order.length;
    $("quest-fill").style.width = (order.length ? done / order.length * 100 : 0).toFixed(1) + "%";
    if (!next) { $("quest-dist").textContent = ""; }
    var hearts = Math.round(order.length ? done / order.length * 5 : 0);
    qsa(".hud-heart").forEach(function (h, i) { var full = i < hearts; if (full && !h.classList.contains("is-full")) { h.classList.add("is-full", "is-pop"); setTimeout(function () { h.classList.remove("is-pop"); }, 400); } else if (!full) { h.classList.remove("is-full"); } });
    var acc = save.quests.length;
    $("quest-side").textContent = acc ? acc + window.PULAU.translate(" misi sampingan diterima") : "";
    qsa("[data-nav-target]").forEach(function (n) { n.classList.toggle("is-visited", isVisited(n.getAttribute("data-nav-target"))); });
    refreshWorldMap();
  }

  /* ---------- fast travel ---------- */
  function travelTo(id, opts) {
    opts = opts || {};
    if (G.mode !== "game") { scrollToSection(id); return; }
    if (!R || !G.ready || G.lost || !G.locByID || !G.locByID[id]) { if (G.panel && G.panel !== id) { closePanel({ instant: true }); } openPanel(id, opts); return; }
    var L = G.locByID[id], d = L.doors[0], p = G.player;
    if (L.doors.length > 1) {
      if (opts.who) { d = L.doors.filter(function (x) { return x.who === opts.who; })[0] || d; }
      else { var bd = 1e9; L.doors.forEach(function (x) { var dd = Math.hypot(p.x - x.x, p.z - x.z); if (dd < bd) { bd = dd; d = x; } }); }
    }
    var place = function () {
      var ang = Math.atan2(d.lx - d.x, d.lz - d.z);
      p.x = d.x - Math.sin(ang) * 0.7; p.z = d.z - Math.cos(ang) * 0.7;
      if (!walkable(p.x, p.z)) { p.x = d.x; p.z = d.z; }
      p.rot = ang; p.vx = 0; p.vz = 0; p.target = null; p.y = groundY(p.x, p.z);
      G.cam.yaw = ang + Math.PI; G.cam.cur = null; G.cam.tw = null; G.cam.mode = "follow";
      G.insideKey = L.id + ":" + d.who; G.autoEnter = null;
    };
    if (G.panel || reduceMotion) {
      if (G.panel) { closePanel({ instant: true }); }
      place(); renderOnce(); openPanel(id, { who: d.who, instant: false }); return;
    }
    G.traveling = true; sfx("whoosh");
    var veil = $("travel-veil"); veil.classList.add("is-on");
    setTimeout(function () {
      place(); G.sleep = false; wake(); renderOnce();
      veil.classList.remove("is-on");
      setTimeout(function () { G.traveling = false; openPanel(id, { who: d.who }); }, 300);
    }, 560);
  }

  /* ================= UI: modes, panels, navigation, sections ================= */
  G.mode = "game"; G.panel = null; G.panelEl = null; G.mapOpen = false; G.viewerOpen = false;

  /* ---------- toasts, achievements, discovery ---------- */
  function toast(kicker, title, sub, ico) {
    var box = $("toasts"), t = el("div", "toast", mkId("toast"));
    t.innerHTML = '<span class="toast-ico" id="' + mkId("ti") + '">' + icon(ico || "i-star") + '</span><span class="toast-body" id="' + mkId("tb") + '"><span class="toast-k" id="' + mkId("tk") + '"></span><span class="toast-t" id="' + mkId("tt") + '"></span><span class="toast-s" id="' + mkId("ts") + '"></span></span>';
    t.querySelector(".toast-k").textContent = kicker || ""; t.querySelector(".toast-t").textContent = title || ""; t.querySelector(".toast-s").textContent = sub || "";
    if (!sub) { t.querySelector(".toast-s").remove(); }
    while (box.children.length > 2) { box.firstElementChild.remove(); }
    box.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add("is-on"); }); });
    setTimeout(function () { t.classList.remove("is-on"); setTimeout(function () { t.remove(); }, 550); }, 3800);
  }
  var ACH = {
    start: [window.PULAU.translate("Langkah Pertama"), window.PULAU.translate("Kamu tiba di ") + WORLD + ".", "i-anchor"],
    explorer3: [window.PULAU.translate("Penjelajah Pemula"), window.PULAU.translate("Tiga lokasi sudah kamu kunjungi."), "i-map"],
    all: [window.PULAU.translate("Penjelajah Sejati"), window.PULAU.translate("Semua lokasi di pulau sudah kamu jelajahi!"), "i-trophy"],
    rsvp: [window.PULAU.translate("Tamu Teladan"), window.PULAU.translate("Formulir party sudah terkirim."), "i-flag"],
    wish: [window.PULAU.translate("Pembawa Doa"), window.PULAU.translate("Lenteramu menyala di Taman Pesan."), "i-lantern"],
    gift: [window.PULAU.translate("Hati yang Lapang"), window.PULAU.translate("Koinmu jatuh ke Sumur Harapan."), "i-coin"],
    outfit: [window.PULAU.translate("Gaya Pesta"), window.PULAU.translate("Kostum baru sudah kamu kenakan."), "i-hanger"],
    harta: [window.PULAU.translate("Pemburu Harta"), window.PULAU.translate("Semua kenang-kenangan tersembunyi sudah ditemukan."), "i-chest"],
    quest: [window.PULAU.translate("Pengambil Misi"), window.PULAU.translate("Misi sampingan pertamamu sudah diterima."), "i-scroll"]
  };
  function unlock(key) {
    if (save.ach.indexOf(key) >= 0) { return; }
    save.ach.push(key); persist();
    var a = ACH[key]; if (!a) { return; }
    toast(window.PULAU.translate("Pencapaian terbuka"), a[0], a[1], a[2]); sfx("ach");
  }
  function showDiscovery(L, d) {
    var box = $("discovery"), order = domOrder();
    var n = order.filter(isVisited).length + (isVisited(L.id) ? 0 : 1);
    $("disc-name").textContent = locLabel(L, d);
    $("disc-count").textContent = window.PULAU.translate("Lokasi ") + n + window.PULAU.translate(" dari ") + order.length;
    box.classList.add("is-on");
    clearTimeout(G.discT); G.discT = setTimeout(function () { box.classList.remove("is-on"); }, 2100);
  }
  function domConfetti(anchor) {
    if (reduceMotion || !anchor || !anchor.getBoundingClientRect) { return; }
    var r = anchor.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 3;
    var cols = ["#ffc93d", "#ff6f7d", "#2bb3c0", "#69c46d", "#9b6bff", "#fff3d6"];
    for (var i = 0; i < 26; i++) {
      var s = el("span", "", mkId("cf"));
      s.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;width:9px;height:" + (i % 3 ? 9 : 14) + "px;border-radius:" + (i % 2 ? "50%" : "2px") + ";background:" + cols[i % cols.length] + ";z-index:950;pointer-events:none;";
      body.appendChild(s);
      var a = Math.random() * TAU, sp = 90 + Math.random() * 160;
      var anim = s.animate([{ transform: "translate(0,0) rotate(0deg)", opacity: 1 }, { transform: "translate(" + (Math.cos(a) * sp).toFixed(0) + "px," + (Math.sin(a) * sp - 60 + 240).toFixed(0) + "px) rotate(" + (Math.random() * 720).toFixed(0) + "deg)", opacity: 0 }], { duration: 1100 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" });
      anim.onfinish = (function (n) { return function () { n.remove(); }; })(s);
    }
  }
  function celebrate() {
    if (R && G.player && G.mode === "game") { heartBurst(G.player.x, G.player.y + 1.8, G.player.z); }
    domConfetti($("hud-player"));
  }
  function markVisited(id) {
    if (!isVisited(id)) {
      save.visited.push(id); persist();
      var order = domOrder(), n = order.filter(isVisited).length;
      if (n === 3) { unlock("explorer3"); }
      if (n === order.length && n > 3) { setTimeout(function () { unlock("all"); celebrate(); }, 900); }
    }
    updateQuest();
  }

  /* ---------- modes ---------- */
  function applyMode(m) {
    G.mode = m;
    body.classList.toggle("mode-game", m === "game"); body.classList.toggle("mode-page", m === "page");
    save.mode = m; persist();
    setIcon($("btn-mode-ico"), (m === "game" ? "i-list" : "i-joystick"));
    $("btn-mode-lbl").textContent = m === "game" ? window.PULAU.translate("Tampilan Biasa") : window.PULAU.translate("Mode Jelajah");
    $("btn-mode").setAttribute("aria-label", m === "game" ? window.PULAU.translate("Beralih ke tampilan biasa") : window.PULAU.translate("Beralih ke mode jelajah"));
    $("hero-go-label").textContent = m === "game" ? window.PULAU.translate("Mulai Jelajah") : window.PULAU.translate("Lanjut Membaca");
    if (m === "page") {
      var keep = G.panel;
      if (G.panel) { closePanel({ instant: true, silent: true }); }
      if (G.mapOpen) { closeMap(true); }
      qsa(".loc").forEach(function (s) { s.classList.remove("is-open", "is-closing"); });
      body.classList.remove("panel-open", "map-open");
      if (R && G.ready) { G.cam.mode = "page"; camTween(1.6); }
      resizeGL(); G.sleep = false; wake();
      setupPageReveal();
      if (G.started) { revealHero(); if (keep) { setTimeout(function () { scrollToSection(keep, true); }, 30); } else { window.scrollTo(0, 0); } }
      if (reduceMotion) { setTimeout(function () { G.sleep = true; }, 200); }
    } else {
      window.scrollTo(0, 0);
      body.classList.remove("is-locked");
      if (R && G.ready) { G.cam.mode = G.started ? "follow" : "title"; if (G.started) { G.cam.yaw = G.player.rot + Math.PI; } camTween(1.4); }
      resizeGL(); G.sleep = false; wake();
      if ((!R || G.lost) && G.started) { openMap(false, true); }
    }
    setActive(null); if (m === "page") { pageScrollActive(); }
  }

  /* ---------- panels (game mode) ---------- */
  function openPanel(id, opts) {
    opts = opts || {};
    if (G.mode !== "game") { scrollToSection(id); return; }
    var s = secEl(id);
    if (!s || !isAlive(id)) { return; }
    if (G.panel === id) { return; }
    if (G.panel) { closePanel({ instant: true, silent: true }); }
    if (G.mapOpen) { closeMap(true); }
    G.panel = id; G.panelEl = s;
    body.classList.add("panel-open");
    s.classList.remove("is-closing");
    s.scrollTop = 0;
    s.classList.add("is-open");
    if (!s.classList.contains("in-view")) { requestAnimationFrame(function () { s.classList.add("in-view"); }); }
    onPanelOpen(id, opts);
    markVisited(id);
    sfx("open");
    clearTimeout(G.sleepT);
    var rem = G.cam.tw ? (G.cam.tw.dur - G.cam.tw.t) * 1000 + 250 : 700;
    G.sleepT = setTimeout(function () { if (G.panel) { G.sleep = true; } }, rem);
    setTimeout(function () { var c = s.querySelector(".panel-close"); if (c && G.panel === id) { try { c.focus({ preventScroll: true }); } catch (e) { c.focus(); } } }, 80);
    setActive(id, true);
  }
  function closePanel(opts) {
    opts = opts || {};
    var s = G.panelEl, id = G.panel;
    if (!s) { return; }
    G.panel = null; G.panelEl = null;
    body.classList.remove("panel-open");
    clearTimeout(G.sleepT); G.sleep = false; wake();
    onPanelClose(id, opts);
    if (opts.instant || reduceMotion) { s.classList.add("no-trans"); s.classList.remove("is-open", "is-closing"); void s.offsetWidth; setTimeout(function () { s.classList.remove("no-trans"); }, 60); }
    else { s.classList.add("is-closing"); s.classList.remove("is-open"); setTimeout(function () { s.classList.remove("is-closing"); }, 460); }
    if (!opts.silent) { sfx("close"); }
    setActive(null);
    if ((!R || G.lost) && G.mode === "game" && G.started && !opts.instant) { setTimeout(function () { openMap(false, true); }, 60); }
    if (R && G.ready) { var cv = $("world-canvas"); if (!opts.instant) { try { cv.focus({ preventScroll: true }); } catch (e) { /* ignore */ } } }
  }
  function onPanelOpen(id, opts) {
    if (id === "couple") { selectTab(opts.who === "bride" ? "bride" : "groom", true); animateStats(); }
    if (id === "dresscode") { syncMirror(); }
    if (id === "harta") { refreshHarta(); }
    if (id === "kisah") { $("ach-summary-fill").style.width = G.achPct || "0%"; }
  }
  function onPanelClose(id) {
    if (id === "video") { var v = $("vid-el"); if (v && !v.paused) { v.pause(); } }
    if (id === "hero" && !G.tutShown) { G.tutShown = true; setTimeout(function () { toast(window.PULAU.translate("Tips"), finePointer ? window.PULAU.translate("WASD untuk berjalan, seret untuk memutar kamera") : window.PULAU.translate("Geser tongkat di kiri bawah, atau ketuk tanah untuk berjalan"), window.PULAU.translate("Ikuti berlian emas untuk misi utama."), "i-joystick"); }, 500); }
  }
  function nextOf(id) { var o = domOrder(), i = o.indexOf(id); return o.length ? o[(i + 1) % o.length] : null; }

  /* ---------- navigation ---------- */
  function scrollToSection(id, instant) {
    var t = secEl(id);
    if (!t || t.style.display === "none") { return; }
    if (G.mapOpen) { closeMap(true); }
    var y = t.getBoundingClientRect().top + window.pageYOffset - 4;
    G.navLock = performance.now() + (instant ? 200 : 1100);
    window.scrollTo({ top: Math.max(0, y), behavior: instant || reduceMotion ? "auto" : "smooth" });
    setActive(id, true);
  }
  function setActive(id, fromTap) {
    if (id === G.activeNav && !fromTap) { return; }
    qsa("[data-nav-target]").forEach(function (n) { n.classList.toggle("is-active", n.getAttribute("data-nav-target") === id); });
    G.activeNav = id;
    clearTimeout(G.railT);
    if (!id) { return; }
    if (fromTap) { centerRail(id); } else { G.railT = setTimeout(function () { centerRail(id); }, 180); }
  }
  function centerRail(id) {
    var rail = $("nav-rail"), item = navItem(id);
    if (!rail || !item || item.style.display === "none") { return; }
    if (rail.scrollWidth <= rail.clientWidth + 1) { return; }
    var rr = rail.getBoundingClientRect(), ir = item.getBoundingClientRect();
    var target = rail.scrollLeft + (ir.left - rr.left - rail.clientLeft) - (rail.clientWidth - ir.width) / 2;
    target = clamp(target, 0, rail.scrollWidth - rail.clientWidth);
    if (Math.abs(target - rail.scrollLeft) < 2) { return; }
    try { rail.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" }); } catch (e) { rail.scrollLeft = target; }
  }
  function pageScrollActive() {
    if (G.mode !== "page") { return; }
    if (G.navLock && performance.now() < G.navLock) { return; }
    var line = window.innerHeight * 0.35, cur = null;
    qsa("body > [data-section]").forEach(function (s) { var id = s.getAttribute("data-section"); if (id === "cover" || s.style.display === "none") { return; } if (s.getBoundingClientRect().top <= line) { cur = id; } });
    if (!cur) { var o = domOrder(); cur = o[0] || null; }
    if (cur !== G.activeNav) { setActive(cur); }
  }
  function bindNav() {
    $("nav").addEventListener("click", function (e) {
      var b = e.target.closest("[data-nav-target]");
      if (!b) { return; }
      e.preventDefault();
      var id = b.getAttribute("data-nav-target");
      audioInit(); sfx("click");
      if (G.mode === "game") { if (G.panel === id) { return; } if (G.mapOpen) { closeMap(true); } travelTo(id); setActive(id, true); }
      else { scrollToSection(id); }
    });
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (G.mode !== "page") { return; }
        if (G.navLock && performance.now() >= G.navLock) { G.navLock = 0; }
        pageScrollActive();
        bottomRelease();
      });
    }, { passive: true });
  }

  /* ---------- reveal (scroll mode) ---------- */
  var regObs = null, revObs = null, heroRevealed = false;
  function revealHero() { if (heroRevealed) { return; } heroRevealed = true; $("sec-hero").classList.add("in-view"); }
  function setupPageReveal() {
    if (G.revealSetup) { return; }
    G.revealSetup = true;
    var regions = qsa("body > header, body > section, body > footer");
    if (!("IntersectionObserver" in window)) {
      regions.forEach(function (r) { if (r.id !== "sec-cover" && r.id !== "sec-hero") { r.classList.add("in-view"); } });
      qsa(".reveal").forEach(function (e) { if (!e.closest("#sec-hero")) { e.classList.add("in-view"); } });
      return;
    }
    var opt = { threshold: 0, rootMargin: "0px 0px -33% 0px" };
    regObs = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in-view"); regObs.unobserve(en.target); } }); }, opt);
    revObs = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in-view"); revObs.unobserve(en.target); } }); }, opt);
    regions.forEach(function (r) { if (r.id === "sec-cover" || r.id === "sec-hero" || r.classList.contains("in-view")) { return; } regObs.observe(r); });
    qsa(".reveal").forEach(function (e) { if (e.closest("#sec-hero") || e.classList.contains("in-view")) { return; } revObs.observe(e); });
    bottomRelease();
  }
  function observeReveal(e) { if (revObs && G.mode === "page" && !e.closest(".in-view")) { revObs.observe(e); } }
  function bottomRelease() {
    if (G.mode !== "page" || !G.started) { return; }
    if (window.innerHeight + window.pageYOffset >= doc.documentElement.scrollHeight - 4) {
      qsa("body > section, body > footer, body > header").forEach(function (r) { if (r.id !== "sec-cover") { r.classList.add("in-view"); } });
      qsa(".reveal").forEach(function (e) { e.classList.add("in-view"); });
    }
  }

  /* ---------- world map overlay ---------- */
  function openMap(fromUser, worldMode) {
    if (G.panel && !worldMode) { closePanel({ instant: true, silent: true }); }
    refreshWorldMap();
    var ov = $("map-overlay");
    ov.classList.add("is-open"); ov.classList.toggle("is-world", !!worldMode);
    G.mapOpen = true; body.classList.add("map-open");
    clearMapSel(); layoutMapLabels();
    if (G.mode === "page") { body.classList.add("is-locked"); }
    if (fromUser) { sfx("open"); }
    clearTimeout(G.sleepT); G.sleepT = setTimeout(function () { if (G.mapOpen && G.mode === "game") { G.sleep = true; } }, 500);
    if (!worldMode) { setTimeout(function () { try { $("map-close").focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 60); }
  }
  function closeMap(silent) {
    var ov = $("map-overlay");
    if (!G.mapOpen) { return; }
    ov.classList.remove("is-open", "is-world");
    G.mapOpen = false; body.classList.remove("map-open", "is-locked");
    clearMapSel();
    clearTimeout(G.sleepT); G.sleep = false; wake();
    if (!silent) { sfx("close"); }
  }
  function escapeAll() {
    if (G.viewerOpen) { closeViewer(); return; }
    if (G.mapOpen && !$("map-overlay").classList.contains("is-world")) { closeMap(); return; }
    if (G.panel) { closePanel(); }
  }

  /* ---------- cover ---------- */
  function setLoader(p) { $("loader-fill").style.width = Math.round(p * 100) + "%"; $("loader-pct").textContent = Math.round(p * 100) + "%"; }
  var TIPS = [window.PULAU.translate("Tips: ketuk tanah untuk berjalan ke sana."), window.PULAU.translate("Tips: ikuti berlian emas untuk misi utama."), window.PULAU.translate("Tips: ada enam harta tersembunyi di pulau ini."), window.PULAU.translate("Tips: waktu di pulau berjalan — malam hari penuh kunang-kunang."), window.PULAU.translate("Tips: pesan yang kamu tinggalkan akan menjadi lentera.")];
  function initCover() {
    if (P1) { $("cover-date-text").textContent = pad2(P1.d) + " · " + pad2(P1.mo) + " · " + P1.y; $("cover-year").textContent = String(P1.y); }
    else { $("cover-date").style.display = "none"; }
    $("loader-tip").textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
    var order = domOrder(), n = order.filter(isVisited).length;
    if (n > 1) { body.classList.add("has-save"); $("cover-start-label").textContent = window.PULAU.translate("Lanjutkan · ") + Math.round(n / Math.max(1, order.length) * 100) + "%"; }
    $("cover-start").addEventListener("click", function () { startGame(); });
    $("cover-restart").addEventListener("click", function () { save.visited = []; save.found = []; persist(); qsa(".hj-slot").forEach(function (s) { s.classList.remove("is-found"); }); if (G.harta) { G.harta.forEach(function (h) { h.got = false; }); } startGame(); });
  }
  function startGame() {
    if (G.started) { return; }
    G.started = true;
    audioInit(); startMusic(); sfx("magic");
    var cover = $("sec-cover");
    if (cover) { cover.classList.add("is-leaving"); }
    body.classList.add("is-started"); body.classList.remove("is-cover");
    G.sleep = false;
    unlock("start");
    if (G.mode === "game") {
      if (R && G.ready) { G.cam.mode = "follow"; G.cam.yaw = G.player.rot + Math.PI; camTween(reduceMotion ? 0.01 : 2.4); wake(); }
      setTimeout(function () { openPanel("hero"); }, reduceMotion ? 20 : 280);
    } else {
      setTimeout(revealHero, reduceMotion ? 0 : 260);
      markVisited("hero");
    }
    var gone = function (e) {
      if (!cover || (e && (e.target !== cover || e.propertyName !== "opacity"))) { return; }
      if (cover.classList.contains("is-leaving")) { cover.style.display = "none"; }
      cover.removeEventListener("transitionend", gone);
    };
    if (cover) { cover.addEventListener("transitionend", gone); setTimeout(gone, 2400); }
    updateQuest();
  }
  var bgm = $("bgm"), bgmUrl = clean(bgm.getAttribute("data-src"));
  function startMusic() {
    if (!bgmUrl || !soundOn || window.PULAU.silentPlayback) { return; }
    if (!bgm.getAttribute("src")) { bgm.src = bgmUrl; }
    bgm.volume = 0.55;
    var pr = bgm.play(); if (pr && pr.catch) { pr.catch(function () { /* autoplay blocked until next gesture */ }); }
  }
  function setSound(on) {
    soundOn = on; window.PULAU.soundAllowed = on; save.sound = on; persist();
    $("btn-sound").classList.toggle("is-off", !on);
    setIcon($("btn-sound-ico"), (on ? "i-sound" : "i-mute"));
    if (on && !window.PULAU.silentPlayback) { audioInit(); if (G.started) { startMusic(); } } else { bgm.pause(); }
  }

  /* ================= SECTION CONTENT & INTERACTIONS ================= */
  function hideIfEmpty(id, srcId) { var e = $(id); if (e && !txt(srcId || id)) { e.style.display = "none"; return true; } return false; }
  var INI = (GROOM.charAt(0) || "") + "&" + (BRIDE.charAt(0) || "");

  /* ---------- hero ---------- */
  function initHero() {
    $("hero-initials").textContent = INI;
    hideIfEmpty("hero-greeting"); hideIfEmpty("hero-intro");
    if (P1) {
      $("hero-cal-m").textContent = monthShort(P1); $("hero-cal-d").textContent = String(P1.d); $("hero-cal-y").textContent = String(P1.y);
      $("hero-day").textContent = dayLabel(P1); $("hero-time").textContent = P1.hasTime ? window.PULAU.translate("Pukul ") + hm(P1.h, P1.mi) + " " + TZ_RAW : "";
    } else { $("hero-date").style.display = "none"; }
    hideIfEmpty("hero-venue", "hero-venue-name");
    var days = daysUntil(T1);
    if (days === null) { $("hero-count").style.display = "none"; }
    else if (days > 1) { $("hero-days").textContent = days + window.PULAU.translate(" hari lagi"); }
    else if (days === 1) { $("hero-days").textContent = window.PULAU.translate("besok!"); }
    else if (days === 0) { $("hero-days").textContent = window.PULAU.translate("hari ini!"); }
    else { $("hero-count-a").textContent = window.PULAU.translate("Event utama telah"); $("hero-days").textContent = window.PULAU.translate("berlangsung"); }
    $("hero-go").addEventListener("click", function () { sfx("click"); if (G.mode === "game") { closePanel(); } else { var n = nextOf("hero"); if (n) { scrollToSection(n); } } });
    $("hero-map").addEventListener("click", function () { sfx("click"); openMap(true); });
    var card = $("hero-card"), tilt = $("hero-card-tilt");
    card.addEventListener("pointermove", function (e) {
      if (reduceMotion) { return; }
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty("--tx", (x * 22).toFixed(1) + "deg"); tilt.style.setProperty("--ty", (-y * 18).toFixed(1) + "deg");
      $("hero-card-foil").style.setProperty("--fx", (50 + x * 80).toFixed(0) + "%"); $("hero-card-foil").style.setProperty("--fy", (50 + y * 80).toFixed(0) + "%");
    });
    card.addEventListener("pointerleave", function () { tilt.style.setProperty("--tx", "0deg"); tilt.style.setProperty("--ty", "0deg"); });
  }

  /* ---------- prasasti ---------- */
  function initPrasasti() {
    hideIfEmpty("quote-arabic"); hideIfEmpty("quote-source");
    if (!txt("quote-text") && !txt("quote-arabic")) { hideSection("prasasti"); return; }
    var scene = $("tablet-scene"), tab = $("tablet");
    $("tablet-touch").addEventListener("click", function () {
      audioInit(); sfx("magic");
      scene.classList.remove("is-lit"); void scene.offsetWidth; scene.classList.add("is-lit");
      $("tablet-touch-label").textContent = window.PULAU.translate("Prasasti menyala");
    });
    scene.addEventListener("pointermove", function (e) {
      if (reduceMotion) { return; }
      var r = scene.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tab.style.setProperty("--ry", (x * 26 - 4).toFixed(1) + "deg"); tab.style.setProperty("--rx", (-y * 14 + 4).toFixed(1) + "deg");
    });
    scene.addEventListener("pointerleave", function () { tab.style.setProperty("--ry", "-12deg"); tab.style.setProperty("--rx", "5deg"); });
  }

  /* ---------- couple ---------- */
  function parseStats(s) {
    return clean(s).split(/[,;\n]+/).map(function (x) {
      var m = /^\s*(.+?)\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*$/.exec(x);
      return m ? { n: m[1], v: clamp(Math.round(parseFloat(m[2].replace(",", "."))), 0, 10) } : null;
    }).filter(Boolean).slice(0, 6);
  }
  var STATS = { groom: [], bride: [] };
  function initCouple() {
    ["groom", "bride"].forEach(function (w) {
      $("cs-" + w + "-initial").textContent = (w === "groom" ? GROOM : BRIDE).charAt(0);
      setImg($("cs-" + w + "-photo"));
      ["class", "full", "parents", "origin"].forEach(function (k) { hideIfEmpty("cs-" + w + "-" + k, k === "class" ? "cs-" + w + "-class-text" : k === "origin" ? "cs-" + w + "-origin-text" : null); });
      ["skill", "item"].forEach(function (k) { if (!txt("cs-" + w + "-" + k)) { $("cs-" + w + "-" + k + "-row").style.display = "none"; } });
      var ig = clean(txt("cs-" + w + "-ig-text")).replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*$/, "");
      if (ig) { $("cs-" + w + "-ig").href = "https://www.instagram.com/" + encodeURIComponent(ig) + "/"; } else { $("cs-" + w + "-ig").style.display = "none"; }
      STATS[w] = parseStats(txt("cs-" + w + "-stats-src"));
      var box = $("cs-" + w + "-stats"); box.innerHTML = "";
      if (!STATS[w].length) { box.style.display = "none"; }
      STATS[w].forEach(function (st) {
        var row = el("div", "stat", mkId("stat")), nm = el("span", "stat-name", mkId("stn")), bar = el("span", "stat-bar", mkId("stb")), val = el("span", "stat-val", mkId("stv"));
        nm.textContent = st.n; val.textContent = String(st.v);
        for (var i = 0; i < 10; i++) { var pip = el("span", "stat-pip", mkId("pip")); pip.setAttribute("data-on", i < st.v ? "1" : "0"); bar.appendChild(pip); }
        row.appendChild(nm); row.appendChild(bar); row.appendChild(val); box.appendChild(row);
      });
    });
    qsa(".cs-tab").forEach(function (t) { t.addEventListener("click", function () { sfx("click"); selectTab(t.getAttribute("data-who")); }); });
    drawRadar();
    $("cs-join").addEventListener("click", function () {
      var party = $("cs-party"); party.classList.add("is-joined"); sfx("ach");
      var u = unionStats(), avg = u.length ? u.reduce(function (a, s) { return a + s.v; }, 0) / u.length : 10;
      $("cs-join-result").textContent = window.PULAU.translate("Party terbentuk! ") + GROOM + " & " + BRIDE + window.PULAU.translate(" · rata-rata statistik ") + avg.toFixed(1).replace(".", ",") + " / 10";
      domConfetti($("cs-join"));
    });
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { animateStats(); } }); }, { threshold: 0.2 });
      io.observe($("cs-stage"));
    }
  }
  function selectTab(who, silent) {
    qsa(".cs-tab").forEach(function (t) { var on = t.getAttribute("data-who") === who; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
    qsa(".cs-card").forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-who") === who); });
    if (!silent) { animateStats(); }
  }
  function animateStats() {
    qsa(".stat-pip").forEach(function (p, i) { p.classList.remove("is-on"); if (p.getAttribute("data-on") === "1") { setTimeout(function () { p.classList.add("is-on"); }, reduceMotion ? 0 : 200 + (i % 10) * 45); } });
  }
  function unionStats() {
    var names = [];
    STATS.groom.concat(STATS.bride).forEach(function (s) { if (names.indexOf(s.n.toLowerCase()) < 0) { names.push(s.n.toLowerCase()); } });
    return names.slice(0, 6).map(function (n) {
      var g = STATS.groom.filter(function (s) { return s.n.toLowerCase() === n; })[0], b = STATS.bride.filter(function (s) { return s.n.toLowerCase() === n; })[0];
      return { n: (g || b).n, g: g ? g.v : 0, b: b ? b.v : 0, v: Math.max(g ? g.v : 0, b ? b.v : 0) };
    });
  }
  function drawRadar() {
    var svg = $("cs-radar"), u = unionStats();
    svg.innerHTML = "";
    if (u.length < 3) { svg.style.display = "none"; $("cs-party-note").textContent = window.PULAU.translate("Dua karakter, satu party."); return; }
    var n = u.length, R0 = 84;
    var pt = function (i, v) { var a = -Math.PI / 2 + i / n * TAU; return [Math.cos(a) * R0 * v / 10, Math.sin(a) * R0 * v / 10]; };
    [0.25, 0.5, 0.75, 1].forEach(function (k) { svgEl("polygon", { points: u.map(function (s, i) { return pt(i, 10 * k).map(function (q) { return q.toFixed(1); }).join(","); }).join(" "), "class": "rd-grid" }, svg); });
    u.forEach(function (s, i) {
      var e = pt(i, 10); svgEl("line", { x1: 0, y1: 0, x2: e[0].toFixed(1), y2: e[1].toFixed(1), "class": "rd-axis" }, svg);
      var l = pt(i, 12.4), t = svgEl("text", { x: l[0].toFixed(1), y: (l[1] + 4).toFixed(1), "text-anchor": Math.abs(l[0]) < 8 ? "middle" : l[0] > 0 ? "start" : "end", "class": "rd-lbl" }, svg);
      t.textContent = s.n;
    });
    var poly = function (key, cls) { svgEl("polygon", { points: u.map(function (s, i) { return pt(i, s[key]).map(function (q) { return q.toFixed(1); }).join(","); }).join(" "), "class": "rd-poly " + cls }, svg); };
    poly("v", "rd-union"); poly("g", "rd-groom"); poly("b", "rd-bride");
  }

  /* ---------- kisah (achievements) ---------- */
  function initKisah() {
    var shown = 0;
    window.PULAU.storyIds.forEach(function (i) {
      var li = $("ach-" + i), title = txt("ach-" + i + "-title"), text = txt("ach-" + i + "-text");
      if (!title && !text) { li.style.display = "none"; return; }
      shown++;
      if (!title) { $("ach-" + i + "-title").textContent = window.PULAU.translate("Pencapaian ") + i; }
      hideIfEmpty("ach-" + i + "-date");
      setImg($("ach-" + i + "-thumb")); setImg($("ach-" + i + "-photo"));
      if (!text) { $("ach-" + i + "-text").style.display = "none"; }
      var btn = $("ach-" + i + "-btn");
      btn.addEventListener("click", function () { var open = !li.classList.contains("is-open"); li.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); sfx(open ? "open" : "close"); });
    });
    if (!shown) { hideSection("kisah"); return; }
    var next = $("ach-next"), hasNext = !!txt("ach-next-title");
    if (!hasNext) { next.style.display = "none"; }
    var total = shown + (hasNext ? 1 : 0);
    $("ach-count").textContent = String(shown); $("ach-total").textContent = String(total);
    G.achPct = (shown / total * 100).toFixed(0) + "%";
    if (hasNext) {
      var days = daysUntil(T1);
      if (days === null) { $("ach-next-note").textContent = window.PULAU.translate("Terbuka pada hari pernikahan"); }
      else if (days > 0) { $("ach-next-note").textContent = window.PULAU.translate("Terbuka dalam ") + days + window.PULAU.translate(" hari · ") + dayLabel(P1); $("ach-next-fill").style.width = clamp(100 - days / 3.65, 4, 97).toFixed(0) + "%"; }
      else { next.classList.remove("ach-locked"); $("ach-next-date").textContent = window.PULAU.translate("Terbuka!"); $("ach-next-note").textContent = window.PULAU.translate("Diraih bersama semua tamu yang hadir."); $("ach-next-tier").textContent = window.PULAU.translate("Legenda"); $("ach-next-fill").style.width = "100%"; $("ach-count").textContent = String(total); G.achPct = "100%"; }
    }
    var fill = $("ach-summary-fill");
    if (window.IntersectionObserver) { var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { fill.style.width = G.achPct; } }); }); io.observe($("ach-summary")); } else { fill.style.width = G.achPct; }
  }

  /* ---------- countdown & calendar ---------- */
  var cdTimer = 0, cdPrev = {};
  function setCd(k, v) { if (cdPrev[k] === v) { return; } cdPrev[k] = v; var e = $("cd-" + k + "-num"); e.textContent = v; e.classList.remove("is-tick"); void e.offsetWidth; e.classList.add("is-tick"); }
  function tickCountdown() {
    var box = $("cd-box");
    if (!T1) { box.classList.add("is-done"); $("cd-done").textContent = window.PULAU.translate("Tanggal event akan segera diumumkan."); clearInterval(cdTimer); return; }
    var ms = T1.getTime() - Date.now();
    if (ms <= 0) {
      box.classList.add("is-done");
      $("cd-done").textContent = ms > -12 * 3600000 ? window.PULAU.translate("Event sedang berlangsung — sampai jumpa di sana!") : window.PULAU.translate("Event utama telah selesai. Terima kasih sudah menjadi bagian dari cerita kami.");
      $("cd-label").textContent = window.PULAU.translate("Titik simpan terakhir"); clearInterval(cdTimer); return;
    }
    var d = Math.floor(ms / 86400000), h = Math.floor(ms % 86400000 / 3600000), m = Math.floor(ms % 3600000 / 60000), s = Math.floor(ms % 60000 / 1000);
    setCd("d", d > 99 ? String(d) : pad2(d)); setCd("h", pad2(h)); setCd("m", pad2(m)); setCd("s", pad2(s));
  }
  function eventsList() {
    var list = [];
    if (P1) { list.push({ title: (txt("ev-1-name") || window.PULAU.translate("Acara Utama")) + " — " + GROOM + " & " + BRIDE, start: T1, end: P1END ? instantOf(P1END) : null, loc: [txt("ev-1-venue-name"), txt("ev-1-addr")].filter(Boolean).join(", ") }); }
    if (txt("ev-2-name")) { var p2 = P2 || P1; if (p2) { list.push({ title: txt("ev-2-name") + " — " + GROOM + " & " + BRIDE, start: instantOf(p2), end: P2END ? instantOf(P2END) : null, loc: [txt("ev-2-venue-name") || txt("ev-1-venue-name"), txt("ev-2-addr") || txt("ev-1-addr")].filter(Boolean).join(", ") }); } }
    return list;
  }
  function icsEsc(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); }
  function downloadIcs() {
    var evs = eventsList(); if (!evs.length) { return; }
    var now = utcStamp(new Date()), lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Undangan Pulau//ID", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    evs.forEach(function (e, i) {
      var end = e.end || new Date(e.start.getTime() + 2 * 3600000);
      lines.push("BEGIN:VEVENT", "UID:pulau-" + e.start.getTime() + "-" + i + "@undangan", "DTSTAMP:" + now, "DTSTART:" + utcStamp(e.start), "DTEND:" + utcStamp(end), "SUMMARY:" + icsEsc(e.title), "LOCATION:" + icsEsc(e.loc), "DESCRIPTION:" + icsEsc(window.PULAU.translate("Sampai jumpa di hari bahagia kami!")), "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(window.PULAU.translate("Besok: ") + e.title), "END:VALARM", "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    var data = lines.join("\r\n");
    try {
      var blob = new Blob([data], { type: "text/calendar;charset=utf-8" }), url = URL.createObjectURL(blob), a = el("a", "", mkId("ics"));
      a.href = url; a.download = "taklifnoma-" + (GROOM + "-" + BRIDE).toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".ics";
      body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 800);
      $("save-status").textContent = window.PULAU.translate("Progres tersimpan — berkas kalender diunduh.");
    } catch (e) { window.open("data:text/calendar;charset=utf-8," + encodeURIComponent(data), "_blank"); }
    sfx("coin");
  }
  function initCountdown() {
    tickCountdown(); cdTimer = setInterval(tickCountdown, 1000);
    var evs = eventsList();
    if (evs.length) { $("cal-google").href = gcalUrl(evs[0].title, evs[0].start, evs[0].end, evs[0].loc, window.PULAU.translate("Sampai jumpa di hari bahagia kami!")); }
    else { $("save-actions").style.display = "none"; }
    $("cal-google").addEventListener("click", function () { $("save-status").textContent = window.PULAU.translate("Google Kalender"); sfx("coin"); });
    $("cal-ics").addEventListener("click", downloadIcs);
    qsa(".rest-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var h = parseFloat(b.getAttribute("data-rest"));
        G.tod = h; G.env = envAt(h); if (R && lightChanged(G.env.sunDir)) { updateLightVP(G.env.sunDir); }
        qsa(".rest-btn").forEach(function (x) { x.classList.toggle("is-active", x === b); });
        sfx("magic");
        var f = $("world-flash"); f.classList.add("is-on"); setTimeout(function () { f.classList.remove("is-on"); }, 160);
        toast(window.PULAU.translate("Titik simpan"), window.PULAU.translate("Kamu beristirahat sampai ") + b.textContent.trim().toLowerCase(), window.PULAU.translate("Waktu di pulau sudah berganti."), b.querySelector("use").getAttribute("href").slice(1));
        if (R) { G.sleep = false; renderOnce(); if (G.panel) { G.sleep = true; } }
      });
    });
  }

  /* ---------- events ---------- */
  function initEvents() {
    var fillEv = function (n, p, endStr) {
      if (!p) { $("ev-" + n + "-when").style.display = "none"; return; }
      $("ev-" + n + "-m").textContent = monthShort(p); $("ev-" + n + "-d").textContent = String(p.d);
      $("ev-" + n + "-day").textContent = dayLabel(p);
      var tr = n === 2 ? window.PULAU.secondaryEvent.timeLabel : window.PULAU.timeLabel; if (tr) { $("ev-" + n + "-time").textContent = tr; } else { $("ev-" + n + "-time").style.display = "none"; }
    };
    if (!txt("ev-1-name")) { $("ev-1-name").textContent = window.PULAU.translate("Acara Utama"); }
    fillEv(1, P1, "");
    hideIfEmpty("ev-1-addr");
    var v1 = txt("ev-1-venue-name"), a1 = txt("ev-1-addr");
    $("ev-1-map").href = mapsDirUrl([v1, a1].filter(Boolean).join(", "), PLACE_ID);
    var evs = eventsList();
    if (evs[0]) { $("ev-1-cal-link").href = gcalUrl(evs[0].title, evs[0].start, evs[0].end, evs[0].loc); } else { $("ev-1-cal-link").style.display = "none"; }
    if (!txt("ev-2-name")) { $("ev-2").style.display = "none"; $("ev-list").classList.add("is-single"); $("ev-1-step-text").textContent = window.PULAU.translate("Tujuan utama"); }
    else {
      fillEv(2, P2 || P1, "");
      if (!txt("ev-2-venue-name")) { $("ev-2-venue-name").textContent = v1; }
      if (!txt("ev-2-addr")) { $("ev-2-addr").textContent = a1; }
      hideIfEmpty("ev-2-addr");
      var v2 = txt("ev-2-venue-name"), a2 = txt("ev-2-addr");
      $("ev-2-map").href = window.PULAU.secondaryEvent.mapUrl || ((v2 === v1 && a2 === a1) ? mapsDirUrl([v1, a1].filter(Boolean).join(", "), PLACE_ID) : mapsDirUrl([v2, a2].filter(Boolean).join(", "), ""));
      if (evs[1]) { $("ev-2-cal-link").href = gcalUrl(evs[1].title, evs[1].start, evs[1].end, evs[1].loc); } else { $("ev-2-cal-link").style.display = "none"; }
    }
    if (!txt("ev-note-text")) { $("ev-note").style.display = "none"; }
    if (!txt("ev-reward-text")) { $("ev-reward").style.display = "none"; }
  }

  /* ---------- rundown ---------- */
  var RD_ICONS = { heart: "i-heart", users: "i-users", utensils: "i-utensils", camera: "i-camera", mic2: "i-mic", cake: "i-cake", music: "i-music", gift: "i-gift", "party-popper": "i-party", sparkles: "i-sparkle", flower2: "i-flower", home: "i-house", car: "i-car", shirt: "i-hanger", clock: "i-clock", star: "i-star" };
  var RD = [];
  function initRundown() {
    var items = [];
    try { items = JSON.parse(($("wedivo-rundown-data").textContent || "").trim() || "[]"); } catch (e) { items = []; }
    if (!Array.isArray(items)) { items = []; }
    items = items.filter(function (it) { return it && clean(it.title); });
    if (!items.length) { hideSection("rundown"); return; }
    var list = $("rd-list"), groups = [], cur = null;
    items.forEach(function (it) { var d = clean(it.date); if (!cur || cur.date !== d) { cur = { date: d, items: [] }; groups.push(cur); } cur.items.push(it); });
    var k = 0;
    groups.forEach(function (g) {
      var day = el("div", "rd-day", mkId("rdday"));
      var p = parseParts(g.date, "");
      if (p) { var h = el("p", "rd-day-h reveal r-fade", mkId("rdh")); h.textContent = dayLabel(p); h.style.setProperty("--i", String(Math.min(k, 10))); day.appendChild(h); }
      g.items.forEach(function (it) {
        var row = el("div", "rd-item reveal r-up", mkId("rdi")); row.dataset.itemId = it.id; row.style.setProperty("--i", String(Math.min(k++, 10)));
        var ic = el("span", "rd-ico", mkId("rdic")); ic.innerHTML = icon(RD_ICONS[clean(it.icon)] || "i-quest");
        var main = el("div", "rd-main", mkId("rdm"));
        var tm = el("span", "rd-time", mkId("rdt"));
        if (it.isAllDay) { tm.textContent = window.PULAU.translate("Sepanjang hari"); }
        else { var s = parseTime(it.startTime), e = parseTime(it.endTime); tm.textContent = s ? hm(s.h, s.mi) + (e ? " – " + hm(e.h, e.mi) : "") + " " + TZ_RAW : window.PULAU.translate("Waktu menyusul"); }
        var ti = el("p", "rd-title", mkId("rdtt")); ti.textContent = clean(it.title);
        main.appendChild(tm); main.appendChild(ti);
        var meta = [clean(it.location), clean(it.description)].filter(Boolean).join(" · ");
        if (meta) { var me = el("p", "rd-meta", mkId("rdme")); me.textContent = meta; main.appendChild(me); }
        var st = el("span", "rd-state", mkId("rds"));
        row.appendChild(ic); row.appendChild(main); row.appendChild(st); day.appendChild(row);
        RD.push({ row: row, st: st, start: it.isAllDay ? instantOf(parseParts(it.date, "00:00")) : instantOf(parseParts(it.date, it.startTime)), end: it.isAllDay ? instantOf(parseParts(it.date, "23:59")) : instantOf(parseParts(it.date, it.endTime || it.startTime)) });
      });
      list.appendChild(day);
    });
    rundownStatus(); setInterval(rundownStatus, 60000);
  }
  function rundownStatus() {
    var now = Date.now();
    RD.forEach(function (r) {
      if (!r.start) { return; }
      var end = r.end && r.end > r.start ? r.end : new Date(r.start.getTime() + 30 * 60000);
      var done = now > end.getTime(), live = now >= r.start.getTime() && !done;
      r.row.classList.toggle("is-done", done); r.row.classList.toggle("is-now", live);
      r.st.textContent = live ? window.PULAU.translate("Sedang berlangsung") : done ? window.PULAU.translate("Selesai") : "";
    });
  }

  /* ---------- venue ---------- */
  function initVenue() {
    var vn = txt("vn-name"), addr = txt("vn-addr-text");
    if (!addr) { $("vn-addr").style.display = "none"; }
    if (!txt("vn-note-text")) { $("vn-note").style.display = "none"; }
    $("vn-dir").href = mapsDirUrl([vn, addr].filter(Boolean).join(", "), PLACE_ID);
    var fr = $("vn-iframe"), src = fr.getAttribute("data-src") || "";
    var key = (/key=([^&]*)/.exec(src) || [])[1], pid = (/place_id:([^&]*)/.exec(src) || [])[1];
    var canEmbed = clean(key || "") && clean(pid || "");
    var screen = $("sync-screen"), btn = $("sync-btn");
    btn.addEventListener("click", function () {
      if (screen.classList.contains("is-scanning")) { return; }
      audioInit(); sfx("sync");
      screen.classList.remove("is-synced"); screen.classList.add("is-scanning");
      var t0 = performance.now(), dur = reduceMotion ? 200 : 1700;
      var step = function (now) {
        var k = clamp((now - t0) / dur, 0, 1);
        $("sync-pct-num").textContent = Math.round(k * 100) + "%";
        if (k < 1) { requestAnimationFrame(step); return; }
        screen.classList.remove("is-scanning"); screen.classList.add("is-synced");
        if (canEmbed && !fr.getAttribute("src")) { fr.src = src; screen.classList.add("has-embed"); }
        $("sync-btn-label").textContent = window.PULAU.translate("Peta tersinkron");
        toast(window.PULAU.translate("Menara Sinkronisasi"), window.PULAU.translate("Peta tersinkron"), canEmbed ? window.PULAU.translate("Peta dunia nyata terbuka di layar menara.") : window.PULAU.translate("Tekan “Pasang Penanda Arah” untuk membuka petunjuk jalan."), "i-tower");
      };
      requestAnimationFrame(step);
    });
    $("vn-copy").addEventListener("click", function () { copyText([vn, addr].filter(Boolean).join(", "), window.PULAU.translate("Alamat disalin")); });
  }
  function copyText(s, msg) {
    var done = function () { toast(window.PULAU.translate("Tersalin"), msg || window.PULAU.translate("Teks disalin"), s.length > 60 ? s.slice(0, 57) + "…" : s, "i-copy"); sfx("click"); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(s).then(done, function () { legacyCopy(s); done(); }); return; } } catch (e) { /* fall through */ }
    legacyCopy(s); done();
  }
  function legacyCopy(s) { try { var ta = el("textarea", "", mkId("cp")); ta.value = s; ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0"; body.appendChild(ta); ta.select(); doc.execCommand("copy"); ta.remove(); } catch (e) { /* ignore */ } }

  /* ---------- hotel ---------- */
  function initHotel() {
    var shown = 0;
    [1, 2].forEach(function (i) {
      var name = txt("inn-" + i + "-name");
      if (!name) { $("inn-" + i).style.display = "none"; return; }
      shown++;
      var addr = txt("inn-" + i + "-addr-text");
      if (!addr) { $("inn-" + i + "-addr").style.display = "none"; }
      if (!txt("inn-" + i + "-dist-text")) { $("inn-" + i + "-dist").style.display = "none"; }
      if (!txt("inn-" + i + "-price-text")) { $("inn-" + i + "-price").style.display = "none"; }
      if (!txt("inn-" + i + "-dist-text") && !txt("inn-" + i + "-price-text")) { $("inn-" + i + "-meta").style.display = "none"; }
      hideIfEmpty("inn-" + i + "-note");
      var link = $("inn-" + i + "-link"), href = clean(link.getAttribute("href"));
      if (!/^https?:\/\//i.test(href)) { link.style.display = "none"; }
      $("inn-" + i + "-map").href = mapsDirUrl([name, addr].filter(Boolean).join(", "), "");
    });
    if (!shown) { hideSection("hotel"); return; }
    if (shown === 1) { $("inn-list").classList.add("is-single"); qsa(".key-no").forEach(function (k) { k.textContent = "01"; }); }
  }

  /* ---------- dresscode ---------- */
  var DC = { color: null, style: "short" };
  function darker(hx) { var c = hex(hx); return "rgb(" + Math.round(c[0] * 200) + "," + Math.round(c[1] * 200) + "," + Math.round(c[2] * 200) + ")"; }
  function initDresscode() {
    var sw = qsa(".swatch").filter(function (b) {
      var c = clean(b.getAttribute("data-color"));
      if (!/^#[0-9a-fA-F]{6}$/.test(c)) { b.style.display = "none"; return false; }
      if (!txt(b.id + "-name")) { $(b.id + "-name").textContent = c.toUpperCase(); }
      return true;
    });
    var hasText = !!txt("dresscode-intro");
    if (!sw.length && !hasText) { hideSection("dresscode"); return; }
    if (!hasText) { $("dresscode-intro").style.display = "none"; }
    if (!sw.length) { $("dc-swatches").style.display = "none"; $("dc-h-color").style.display = "none"; }
    DC.color = save.outfit && /^#[0-9a-fA-F]{6}$/.test(save.outfit) ? save.outfit : sw.length ? clean(sw[0].getAttribute("data-color")) : "#2bb3c0";
    DC.style = save.style === "long" || save.style === "hijab" ? save.style : "short";
    sw.forEach(function (b) { b.addEventListener("click", function () { sfx("click"); DC.color = clean(b.getAttribute("data-color")); syncMirror(); }); });
    qsa(".dc-style").forEach(function (b) { b.addEventListener("click", function () { sfx("click"); DC.style = b.getAttribute("data-style"); syncMirror(); }); });
    $("dc-apply").addEventListener("click", function () {
      save.outfit = DC.color; save.style = DC.style; persist();
      applyOutfit(DC.color, DC.style);
      var chibi = $("dc-chibi"); chibi.classList.remove("is-spin"); void chibi.getBoundingClientRect(); chibi.classList.add("is-spin");
      $("dc-status").textContent = window.PULAU.translate("Kostum terpasang! Lihat karaktermu di pulau.");
      sfx("magic"); unlock("outfit"); domConfetti($("dc-mirror"));
    });
    syncMirror(); applyOutfit(save.outfit && /^#[0-9a-fA-F]{6}$/.test(save.outfit) ? save.outfit : DC.color, DC.style);
  }
  function syncMirror() {
    var ch = $("dc-chibi"); if (!ch || !DC.color) { return; }
    ch.style.setProperty("--outfit", DC.color); ch.style.setProperty("--outfit-2", darker(DC.color));
    ch.classList.remove("sty-short", "sty-long", "sty-hijab"); ch.classList.add("sty-" + DC.style);
    qsa(".swatch").forEach(function (b) { b.classList.toggle("is-active", clean(b.getAttribute("data-color")).toLowerCase() === DC.color.toLowerCase()); });
    qsa(".dc-style").forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-style") === DC.style); });
  }
  function applyOutfit(color, style) {
    doc.documentElement.style.setProperty("--outfit", color); doc.documentElement.style.setProperty("--outfit-2", darker(color));
    var hud = $("hud-chibi"); hud.classList.remove("sty-short", "sty-long", "sty-hijab"); hud.classList.add("sty-" + style);
    if (G.player) { G.player.outfit = hex(color); G.player.outfit2 = mixC(hex(color), [1, 1, 1], 0.45); G.player.style = style; if (R && G.ready && !G.raf) { renderOnce(); } }
  }

  /* ---------- gallery & photo viewer ---------- */
  var GAL = [], vIdx = 0;
  function initGallery() {
    GAL = window.PULAU.gallery.map(function (image) { return image.src; }).map(clean).filter(function (u) { return !!u; });
    if (!GAL.length && !window.PULAU.preview) { hideSection("gallery"); return; }
    var grid = $("gal-grid");
    GAL.forEach(function (u, i) {
      var b = el("button", "gal-cell reveal r-pop" + (i === 0 && GAL.length >= 3 ? " is-wide" : ""), mkId("gal"));
      b.type = "button"; b.style.setProperty("--i", String(Math.min(i + 2, 10))); b.setAttribute("aria-label", window.PULAU.translate("Buka foto ") + (i + 1));
      var img = el("img", "", mkId("galimg")); img.src = u; img.loading = "lazy"; img.decoding = "async"; img.alt = window.PULAU.gallery[i].alt || "";
      var tag = el("span", "gal-tag", mkId("galtag")); tag.textContent = window.PULAU.gallery[i].caption || window.PULAU.translate("SS ") + pad2(i + 1);
      b.appendChild(img); b.appendChild(tag); b.appendChild(el("span", "gal-brk", mkId("galbrk"))); b.appendChild(el("span", "gal-flash", mkId("galfl")));
      b.addEventListener("click", function () { sfx("click"); openViewer(i); });
      grid.appendChild(b);
    });
    $("gal-count").textContent = GAL.length + window.PULAU.translate(" tangkapan");
    var v = $("viewer");
    $("viewer-prev").addEventListener("click", function () { viewerStep(-1); });
    $("viewer-next").addEventListener("click", function () { viewerStep(1); });
    $("viewer-close").addEventListener("click", closeViewer);
    $("viewer-bg").addEventListener("click", closeViewer);
    $("viewer-grid").addEventListener("click", function () { v.classList.toggle("show-grid"); sfx("click"); });
    qsa(".vf-btn").forEach(function (b) { b.addEventListener("click", function () { var f = b.getAttribute("data-f"); qsa(".vf-btn").forEach(function (x) { x.classList.toggle("is-active", x === b); }); var im = $("viewer-img"); im.classList.remove("f-warm", "f-sepia", "f-mono"); if (f !== "none") { im.classList.add("f-" + f); } sfx("click"); }); });
    var sx = null;
    $("viewer-stage").addEventListener("touchstart", function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
    $("viewer-stage").addEventListener("touchend", function (e) { if (sx === null) { return; } var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) { viewerStep(dx < 0 ? 1 : -1); } }, { passive: true });
  }
  function showPhoto(i) {
    vIdx = (i + GAL.length) % GAL.length;
    var im = $("viewer-img"), v = $("viewer");
    im.classList.add("is-swap");
    setTimeout(function () { im.src = GAL[vIdx]; im.alt = window.PULAU.gallery[vIdx].alt || ""; im.classList.remove("is-swap"); }, reduceMotion ? 0 : 140);
    $("viewer-index").textContent = pad2(vIdx + 1) + " / " + pad2(GAL.length);
    v.classList.remove("is-focusing"); void v.offsetWidth; v.classList.add("is-focusing");
  }
  function openViewer(i) {
    var v = $("viewer");
    v.classList.toggle("is-single", GAL.length <= 1);
    showPhoto(i);
    v.classList.add("is-open"); G.viewerOpen = true;
    if (G.mode === "page") { body.classList.add("is-locked"); }
    sfx("open");
    setTimeout(function () { try { $("viewer-close").focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 60);
  }
  function closeViewer() {
    var v = $("viewer"); if (!G.viewerOpen) { return; }
    v.classList.remove("is-open"); G.viewerOpen = false;
    if (G.mode === "page" && !G.mapOpen) { body.classList.remove("is-locked"); }
    sfx("close");
  }
  function viewerStep(d) { if (GAL.length > 1) { sfx("click"); showPhoto(vIdx + d); } }

  /* ---------- video / live ---------- */
  function ytId(u) { var m = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|shorts\/|embed\/))([A-Za-z0-9_-]{6,})/.exec(u || ""); return m ? m[1] : ""; }
  function initVideo() {
    var ve = $("vid-el"), vsrc = clean(ve.getAttribute("data-src")), live = clean($("vid-live-link").getAttribute("href"));
    if (!/^https?:\/\//i.test(live)) { live = ""; }
    if (!vsrc && !live) { hideSection("video"); return; }
    if (vsrc) { ve.src = vsrc; } else { $("vid-tab-cut").style.display = "none"; $("vid-skip").style.display = "none"; }
    if (!live) { $("vid-tab-live").style.display = "none"; }
    if (!vsrc || !live) { $("vid-tabs").style.display = "none"; }
    var show = function (which) {
      ["cut", "live"].forEach(function (w) { var on = w === which; $("vid-tab-" + w).classList.toggle("is-active", on); $("vid-tab-" + w).setAttribute("aria-selected", on ? "true" : "false"); $("vid-pane-" + w).classList.toggle("is-active", on); });
      if (which === "live" && live && !G.liveBuilt) {
        G.liveBuilt = true;
        var id = ytId(live);
        if (id) { var fr = el("iframe", "", mkId("live")); fr.src = "https://www.youtube.com/embed/" + id; fr.title = window.PULAU.translate("Siaran langsung"); fr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture"); fr.setAttribute("allowfullscreen", ""); fr.loading = "lazy"; $("vid-live-embed").appendChild(fr); $("vid-live-cta").classList.add("is-hidden"); }
      }
      if (which === "live" && !ve.paused) { ve.pause(); }
    };
    $("vid-tab-cut").addEventListener("click", function () { sfx("click"); show("cut"); });
    $("vid-tab-live").addEventListener("click", function () { sfx("click"); show("live"); });
    show(vsrc ? "cut" : "live");
    ve.addEventListener("play", function () { if (!bgm.paused) { bgm.pause(); G.bgmWasOn = true; } });
    var resume = function () { if (G.bgmWasOn && soundOn) { G.bgmWasOn = false; startMusic(); } };
    ve.addEventListener("pause", resume); ve.addEventListener("ended", resume);
    var jokes = [window.PULAU.translate("Adegan ini tidak bisa dilewati — tapi boleh dijeda kapan saja."), window.PULAU.translate("Maaf, tombol lewati sedang dalam perbaikan."), window.PULAU.translate("Tenang, durasinya tidak lebih lama dari antrean prasmanan.")];
    $("vid-skip").addEventListener("click", function () { $("vid-skip-msg").textContent = jokes[(G.jokeN = ((G.jokeN || 0) + 1)) % jokes.length]; sfx("close"); });
  }

  /* ---------- side quests ---------- */
  function initMisi() {
    var shown = 0;
    [1, 2, 3, 4, 5].forEach(function (i) {
      var card = $("mq-" + i);
      if (!txt("mq-" + i + "-title") && !txt("mq-" + i + "-desc")) { card.style.display = "none"; return; }
      shown++;
      hideIfEmpty("mq-" + i + "-desc"); if (!txt("mq-" + i + "-reward")) { $("mq-" + i + "-rw").style.display = "none"; }
      var set = function (on) { card.classList.toggle("is-accepted", on); $("mq-" + i + "-accept-l").textContent = on ? window.PULAU.translate("Misi diterima") : window.PULAU.translate("Terima Misi"); };
      set(save.quests.indexOf(i) >= 0);
      $("mq-" + i + "-accept").addEventListener("click", function () {
        var k = save.quests.indexOf(i), on = k < 0;
        if (on) { save.quests.push(i); sfx("stamp"); unlock("quest"); } else { save.quests.splice(k, 1); sfx("close"); }
        persist(); set(on); misiStatus(); updateQuest();
      });
    });
    if (!shown) { hideSection("misi"); return; }
    misiStatus();
  }
  function misiStatus() { var n = save.quests.length; $("mq-status").textContent = n ? n + window.PULAU.translate(" misi sampingan diterima. Selesaikan di hari-H, ya!") : window.PULAU.translate("Belum ada misi sampingan yang diterima."); }

  /* ---------- treasure journal ---------- */
  var HARTA_ICON = { tiket: "i-ticket", stik: "i-gamepad", surat: "i-letter", kerang: "i-shell", kunci: "i-key", cincin: "i-ring", bunga: "i-flower", kamera: "i-camera" };
  var HJ = [];
  function initHarta() {
    HJ = [];
    [1, 2, 3, 4, 5, 6].forEach(function (i) {
      var slot = $("hj-" + i);
      if (!txt("hj-" + i + "-name")) { slot.style.display = "none"; return; }
      var w = clean(txt("hj-" + i + "-icon")).toLowerCase(), ic = HARTA_ICON[w];
      if (ic) { setIcon($("hj-" + i + "-svg"), ic); }
      hideIfEmpty("hj-" + i + "-story");
      HJ.push(i);
      slot.setAttribute("aria-label", window.PULAU.translate("Harta ") + i);
      slot.addEventListener("click", function () {
        if (save.found.indexOf(i) >= 0) { toast(window.PULAU.translate("Harta ") + i, txt("hj-" + i + "-name"), txt("hj-" + i + "-story"), ic || "i-chest"); return; }
        if (G.mode === "page" || !R || G.lost) { collectHarta(i); }
        else { toast(window.PULAU.translate("Masih tersembunyi"), window.PULAU.translate("Harta ini belum kamu temukan"), window.PULAU.translate("Cari kilau emas yang melayang di sudut-sudut pulau."), "i-sparkle"); sfx("close"); }
      });
    });
    if (!HJ.length) { hideSection("harta"); return; }
    $("hj-total").textContent = String(HJ.length);
    if (!txt("hj-secret-text")) { $("hj-secret").style.display = "none"; }
    refreshHarta();
  }
  function refreshHarta() {
    var found = HJ.filter(function (i) { return save.found.indexOf(i) >= 0; });
    HJ.forEach(function (i) { $("hj-" + i).classList.toggle("is-found", save.found.indexOf(i) >= 0); });
    $("hj-found").textContent = String(found.length);
    var all = HJ.length > 0 && found.length === HJ.length;
    $("hj-secret").classList.toggle("is-open", all);
    $("chest-scene").classList.toggle("is-open", all);
    body.classList.toggle("harta-page", G.mode === "page");
    $("hj-hint").textContent = all ? window.PULAU.translate("Semua harta sudah kamu temukan. Pesan rahasia terbuka!") : G.mode === "page" ? window.PULAU.translate("Ketuk setiap kotak untuk menggali hartanya.") : window.PULAU.translate("Harta tersembunyi berkilau di sudut-sudut pulau. Dekati kilaunya untuk memungutnya.");
  }
  function collectHarta(i) {
    if (save.found.indexOf(i) >= 0) { return; }
    save.found.push(i); persist();
    var slot = $("hj-" + i); slot.classList.add("is-found", "is-new"); setTimeout(function () { slot.classList.remove("is-new"); }, 800);
    var w = clean(txt("hj-" + i + "-icon")).toLowerCase();
    toast(window.PULAU.translate("Harta ditemukan · ") + save.found.filter(function (x) { return HJ.indexOf(x) >= 0; }).length + "/" + HJ.length, txt("hj-" + i + "-name"), txt("hj-" + i + "-story"), HARTA_ICON[w] || "i-chest");
    sfx("pickup");
    if (G.harta) { G.harta.forEach(function (h) { if (h.i === i) { h.got = true; } }); }
    refreshHarta();
    if (HJ.every(function (x) { return save.found.indexOf(x) >= 0; })) { setTimeout(function () { unlock("harta"); celebrate(); }, 700); }
  }

  /* ---------- RSVP / gift / wishes (widget runtime owns submission) ---------- */
  function watchClass(node, fn) { if (!node || !window.MutationObserver) { return; } new MutationObserver(function () { fn(node.className); }).observe(node, { attributes: true, attributeFilter: ["class"] }); }
  function initWell() {
    var ring = $("well-ring"); if (!ring || ring.children.length) { return; }
    for (var i = 0; i < 12; i++) { var sg = el("span", "ws", "ws-" + (i + 1)); sg.style.transform = "rotateY(" + (i * 30) + "deg) translateZ(80px)"; ring.appendChild(sg); }
  }
  function initForms() {
    initWell();
    if (PDEAD) { $("rsvp-deadline-date").textContent = dayLabel(PDEAD); } else { $("rsvp-deadline").classList.add("is-empty"); }
    var pax = $("rsvp-pax");
    var bump = function (d) { var v = clamp((parseInt(pax.value, 10) || 1) + d, 1, 20); pax.value = String(v); pax.dispatchEvent(new Event("input", { bubbles: true })); pax.dispatchEvent(new Event("change", { bubbles: true })); sfx("click"); };
    $("pax-minus").addEventListener("click", function () { bump(-1); }); $("pax-plus").addEventListener("click", function () { bump(1); });
    qsa("[data-wedivo-status]").forEach(function (b) { b.addEventListener("click", function () { sfx("click"); }); });
    var rf = $("rsvp-form"), wasSub = false;
    watchClass(rf, function (c) {
      var sub = /\bis-submitted\b/.test(c);
      if (sub && !wasSub) {
        var sel = rf.querySelector("[data-wedivo-status].is-selected"), st = sel ? sel.getAttribute("data-wedivo-status") : "attending";
        $("member-name").textContent = clean($("rsvp-name").value) || guestName || window.PULAU.translate("Pemain baru");
        $("member-status").textContent = st === "attending" ? window.PULAU.translate("Ikut party") : st === "not_attending" ? window.PULAU.translate("Mendoakan dari jauh") : window.PULAU.translate("Masih menimbang");
        $("member-pax").textContent = "× " + (parseInt(pax.value, 10) || 1);
        if (st === "not_attending") { $("member-note").textContent = window.PULAU.translate("Terima kasih sudah mengabari. Doamu tetap kami bawa sampai hari-H."); }
        sfx("stamp"); unlock("rsvp"); domConfetti($("member-card"));
      }
      if (/\bis-error\b/.test(c)) { sfx("close"); }
      wasSub = sub;
    });
    var gf = $("gift-form"), gSub = false;
    watchClass(gf, function (c) {
      var sub = /\bis-submitted\b/.test(c);
      if (sub && !gSub) {
        var ws = $("well-scene"); ws.classList.remove("is-tossing"); void ws.offsetWidth; ws.classList.add("is-tossing");
        sfx("coin"); sfx("splash"); unlock("gift");
      }
      gSub = sub;
    });
    var wf = $("wish-form");
    wf.addEventListener("submit", function () { G.wishPending = performance.now(); });
    var list = $("wish-list");
    if (window.MutationObserver) {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) { idTree(n, "wish"); } }); });
        wishCount();
        clearTimeout(G.lampT); G.lampT = setTimeout(function () { syncLanterns(); }, 250);
        if (G.wishPending && performance.now() - G.wishPending < 20000) { G.wishPending = 0; unlock("wish"); }
      }).observe(list, { childList: true, subtree: true });
    }
    wishCount();
  }
  function idTree(n, p) { if (!n.id) { n.id = mkId(p); } Array.prototype.forEach.call(n.querySelectorAll("*"), function (c) { if (!c.id) { c.id = mkId(p); } }); }
  function wishCount() { var n = qsa("#wish-list .wish-card").length; $("wish-count-t").textContent = n ? n + window.PULAU.translate(" lentera sudah menyala di Taman Pesan.") : window.PULAU.translate("Belum ada lentera yang menyala. Jadilah yang pertama!"); }

  /* ---------- closing ---------- */
  function initClosing() {
    ["cr-message", "cr-signoff", "cr-tagline"].forEach(function (id) { hideIfEmpty(id); });
    if (!txt("cr-family")) { $("cr-fam").style.display = "none"; }
    if (!txt("cr-coinviters")) { $("cr-co").style.display = "none"; }
    if (!txt("cr-hashtag-t")) { $("cr-hashtag-row").style.display = "none"; }
    $("cr-hashtag").addEventListener("click", function () { copyText(txt("cr-hashtag-t"), window.PULAU.translate("Tagar disalin")); });
    var credits = $("credits");
    $("cr-roll").addEventListener("click", function () {
      sfx("click");
      if (credits.classList.contains("is-rolling")) { credits.classList.remove("is-rolling"); $("cr-roll-l").textContent = window.PULAU.translate("Putar Kredit"); return; }
      credits.classList.add("is-rolling"); $("cr-roll-l").textContent = window.PULAU.translate("Hentikan");
      $("credits-roll").addEventListener("animationend", function () { credits.classList.remove("is-rolling"); $("cr-roll-l").textContent = window.PULAU.translate("Putar Kredit"); }, { once: true });
    });
    $("cr-replay").addEventListener("click", function () {
      sfx("magic");
      save.visited = ["hero"]; persist();
      if (G.mode === "game") {
        closePanel({ instant: true });
        if (G.player) { G.player.x = 0; G.player.z = 37.6; G.player.y = PIER.y; G.player.rot = Math.PI; G.cam.yaw = 0; G.cam.cur = null; }
        updateQuest(); renderOnce();
        toast(window.PULAU.translate("Main lagi"), window.PULAU.translate("Kembali ke Dermaga Kedatangan"), window.PULAU.translate("Progres lokasi diulang — harta & misimu tetap tersimpan."), "i-refresh");
      } else { updateQuest(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }
    });
  }

  /* ---------- panel buttons (delegated) ---------- */
  function bindPanels() {
    doc.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-close]")) { e.preventDefault(); closePanel(); return; }
      var nx = t.closest("[data-next]");
      if (nx) { e.preventDefault(); var sec = nx.closest("[data-section]"), id = sec ? sec.getAttribute("data-section") : null, n = id ? nextOf(id) : null; if (!n) { return; } sfx("click"); if (G.mode === "game") { travelTo(n); } else { scrollToSection(n); } return; }
      if (t.classList && t.classList.contains("loc-scrim")) { closePanel(); }
    });
    $("map-close").addEventListener("click", function () { closeMap(); });
    $("map-bg").addEventListener("click", function () { if (!$("map-overlay").classList.contains("is-world")) { closeMap(); } });
    $("map-go").addEventListener("click", function () { goMapSel(); });
    $("map-frame").addEventListener("click", function (e) { if (G.mapSel && !e.target.closest(".map-pin")) { clearMapSel(); } });
    $("btn-mode").addEventListener("click", function () { audioInit(); sfx("click"); applyMode(G.mode === "game" ? "page" : "game"); refreshHarta(); });
    $("btn-sound").addEventListener("click", function () { setSound(!soundOn); window.PULAU.audioChosen = true; if (soundOn) { sfx("click"); } });
    doc.addEventListener("pointerdown", function () { audioInit(); if (G.started && soundOn && bgmUrl && bgm.paused && !G.bgmWasOn) { startMusic(); } }, { once: true });
  }

  /* ================= INIT ================= */
  function numberLocations() {
    var n = 0;
    qsa("body > [data-section]").forEach(function (s) {
      var id = s.getAttribute("data-section");
      if (id === "cover" || s.style.display === "none") { return; }
      n++;
      var num = s.querySelector(".loc-num"); if (num) { num.textContent = window.PULAU.translate("Lokasi ") + pad2(n); }
    });
  }
  function loaded() { setLoader(1); setTimeout(function () { body.classList.add("is-loaded"); }, 220); }
  function noGL() {
    body.classList.add("no-gl");
    if (!TREES.length) { try { buildStatic(aliveLocs()); } catch (e) { /* map still draws without trees */ } }
    buildFallbackArt(); buildWorldMap(); refreshWorldMap();
    G.ready = false; R = null;
    loaded();
    if (G.started && G.mode === "game" && !G.panel) { openMap(false, true); }
  }
  function navHeight() { var n = $("nav"); if (n && n.offsetHeight) { body.style.setProperty("--nav-h", n.offsetHeight + "px"); } }
  function init() {
    var m = reduceMotion ? "page" : save.mode === "page" || save.mode === "game" ? save.mode : "game";
    G.mode = m;
    body.classList.add("is-cover", m === "game" ? "mode-game" : "mode-page");
    qsa("svg text").forEach(function (t) { if (t.childElementCount === 0) { t.textContent = t.textContent.trim(); } });
    var safe = function (fn, name) { try { fn(); } catch (e) { if (window.console) { console.warn("[pulau] " + name, e); } } };
    safe(initHero, "hero"); safe(initPrasasti, "prasasti"); safe(initCouple, "couple"); safe(initKisah, "kisah"); safe(initCountdown, "countdown");
    safe(initEvents, "events"); safe(initRundown, "rundown"); safe(initVenue, "venue"); safe(initHotel, "hotel"); safe(initDresscode, "dresscode");
    safe(initGallery, "gallery"); safe(initVideo, "video"); safe(initMisi, "misi"); safe(initHarta, "harta"); safe(initForms, "forms"); safe(initClosing, "closing");
    setImg($("hero-photo"));
    numberLocations();
    safe(initCover, "cover");
    var coverEl = $("sec-cover");
    if (!coverEl || !$("cover-start") || !isAlive("cover")) { G.coverMissing = true; }
    bindPanels(); bindNav(); bindInput();
    setSound(soundOn);
    buildLocs();
    var now = new Date(); G.tod = now.getHours() + now.getMinutes() / 60;
    if (reduceMotion) { G.todSpeed = 0; }
    var cv = $("world-canvas");
    R = initRenderer(cv);
    if (!R) { noGL(); }
    else {
      cv.setAttribute("tabindex", "-1");
      cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); G.lost = true; noGL(); });
      resizeGL();
      setLoader(0.12);
      setTimeout(function () { setLoader(0.64); }, 60);
      setTimeout(function () {
        try {
          initWorld(function () { /* staged progress shown by the loader */ });
          buildMarkers(); buildCompass(); buildMinimap(); buildWorldMap();
          G.ready = true; G.env = envAt(G.tod); updateLightVP(G.env.sunDir);
          G.cam.mode = G.mode === "page" ? "page" : G.started ? "follow" : "title";
          applyOutfit(save.outfit && /^#[0-9a-fA-F]{6}$/.test(save.outfit) ? save.outfit : DC.color || "#2bb3c0", DC.style || "short");
          updateQuest(); renderOnce(); wake(); loaded();
          if (reduceMotion && G.mode === "page") { setTimeout(function () { G.sleep = true; }, 150); }
        } catch (err) { if (window.console) { console.warn("[pulau] world", err); } noGL(); }
      }, 520);
    }
    applyMode(m);
    updateQuest();
    navHeight();
    if (G.coverMissing) { body.classList.remove("is-cover"); if (G.mode === "page") { revealHero(); } setTimeout(function () { if (!G.started) { startGame(); } }, 600); }
    var rt = 0;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { resizeGL(); navHeight(); if (G.activeNav) { centerRail(G.activeNav); } if (G.mapOpen) { layoutMapLabels(); } }, 120); });
    window.addEventListener("orientationchange", function () { setTimeout(function () { resizeGL(); navHeight(); }, 250); });
    doc.addEventListener("visibilitychange", function () { if (!doc.hidden) { G.last = 0; wake(); } });
  }
  init();

})();
